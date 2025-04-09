// session-store.js - PostgreSQL session store with SSL for Heroku/RDS

const { Pool } = require('pg');
const path = require('path');

// Create a PostgreSQL connection pool using environment variables
const pool = new Pool({
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  ssl: {
    require: true,
    rejectUnauthorized: false // Important for self-signed certificates on RDS
  },
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 15000 // How long to wait for a connection to become available
});

// Establish connection and handle errors
pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
  // Don't exit process to allow reconnection attempts
});

// Test the connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to PostgreSQL database:', err);
    console.error('Connection details (without password):', {
      user: process.env.DB_USERNAME,
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      ssl: 'enabled with rejectUnauthorized: false'
    });
  } else {
    console.log('Connected to PostgreSQL database at time:', res.rows[0].now);
    
    // Create devices table if it doesn't exist
    pool.query(`
      CREATE TABLE IF NOT EXISTS devices (
        id SERIAL PRIMARY KEY,
        session_id TEXT NOT NULL,
        device_id TEXT NOT NULL,
        user_agent TEXT,
        ip_address TEXT,
        last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(session_id, device_id)
      )
    `, (err) => {
      if (err) {
        console.error('Error creating devices table:', err);
      } else {
        console.log('Devices table ready');
      }
    });
  }
});

// Configure session store
function configureSessionStore(session) {
  const pgSession = require('connect-pg-simple')(session);
  
  const sessionStore = new pgSession({
    pool: pool,
    tableName: 'sessions', // Default is "session"
    createTableIfMissing: true, // Automatically create the session table if it doesn't exist
    pruneSessionInterval: 60 * 1000 // Run GC every minute
  });

  // Handle session store errors
  sessionStore.on('error', function(error) {
    console.error('Session store error:', error);
  });

  return sessionStore;
}

// Get device count for a session ID
function getDeviceCount(sessionId) {
  return new Promise((resolve, reject) => {
    if (!sessionId) {
      return resolve(0);
    }

    pool.query(
      'SELECT COUNT(DISTINCT device_id) as count FROM devices WHERE session_id = $1',
      [sessionId],
      (err, result) => {
        if (err) {
          console.error('Error getting device count:', err);
          return resolve(0); // Fail gracefully
        }
        resolve(result.rows[0] ? parseInt(result.rows[0].count) : 0);
      }
    );
  });
}

// Get all devices for a session ID
function getDevices(sessionId) {
  return new Promise((resolve, reject) => {
    if (!sessionId) {
      return resolve([]);
    }

    pool.query(
      'SELECT device_id, user_agent, ip_address, last_seen FROM devices WHERE session_id = $1',
      [sessionId],
      (err, result) => {
        if (err) {
          console.error('Error getting devices:', err);
          return resolve([]); // Fail gracefully
        }
        resolve(result.rows || []);
      }
    );
  });
}

// Get all unique IP addresses for a session ID
function getDeviceLocations(sessionId) {
  return new Promise((resolve, reject) => {
    if (!sessionId) {
      return resolve([]);
    }

    pool.query(
      'SELECT DISTINCT ip_address FROM devices WHERE session_id = $1',
      [sessionId],
      (err, result) => {
        if (err) {
          console.error('Error getting device locations:', err);
          return resolve([]); // Fail gracefully
        }
        resolve(result.rows.map(row => row.ip_address) || []);
      }
    );
  });
}

// Get session IDs for a username
function getSessionsForUser(username) {
  return new Promise((resolve, reject) => {
    if (!username) {
      return resolve([]);
    }

    // Use parameterized query to prevent SQL injection
    pool.query(
      `SELECT sess FROM sessions WHERE sess::text LIKE $1`,
      [`%"username":"${username}"%`],
      (err, result) => {
        if (err) {
          console.error('Error getting sessions for user:', err);
          return resolve([]); // Fail gracefully
        }

        const sessionIds = result.rows.map(row => {
          try {
            const parsed = JSON.parse(row.sess);
            return parsed.id; // The session ID
          } catch (e) {
            return null;
          }
        }).filter(Boolean);

        resolve(sessionIds);
      }
    );
  });
}

// Get devices for multiple session IDs
function getDevicesForSessions(sessionIds) {
  return new Promise((resolve, reject) => {
    if (!sessionIds || !sessionIds.length) {
      return resolve([]);
    }

    // Create placeholders for the query ($1, $2, etc.)
    const placeholders = sessionIds.map((_, index) => `$${index + 1}`).join(',');
    const query = `SELECT session_id, device_id, user_agent, ip_address, last_seen 
                   FROM devices 
                   WHERE session_id IN (${placeholders})`;

    pool.query(query, sessionIds, (err, result) => {
      if (err) {
        console.error('Error getting devices for sessions:', err);
        return resolve([]); // Fail gracefully
      }
      resolve(result.rows || []);
    });
  });
}

// Invalidate (delete) a device
function invalidateDevice(sessionId, deviceId) {
  return new Promise((resolve, reject) => {
    if (!sessionId || !deviceId) {
      return resolve({ success: false, reason: 'Invalid parameters' });
    }

    pool.query(
      'DELETE FROM devices WHERE session_id = $1 AND device_id = $2',
      [sessionId, deviceId],
      (err, result) => {
        if (err) {
          console.error('Error invalidating device:', err);
          return resolve({ success: false, error: err.message });
        }
        resolve({ success: result.rowCount > 0 });
      }
    );
  });
}

// Add a new device record with retry mechanism
function addDevice(sessionId, deviceInfo) {
  return new Promise((resolve, reject) => {
    if (!sessionId) {
      return resolve({ success: false, reason: 'No session ID provided' });
    }

    const { device_id, user_agent, ip_address } = deviceInfo;

    const tryInsert = (retries = 3) => {
      pool.query(
        `INSERT INTO devices (session_id, device_id, user_agent, ip_address, last_seen)
         VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
         ON CONFLICT (session_id, device_id)
         DO UPDATE SET user_agent = $3, ip_address = $4, last_seen = CURRENT_TIMESTAMP
         RETURNING id`,
        [sessionId, device_id, user_agent, ip_address],
        (err, result) => {
          if (err) {
            console.error(`Error adding device (attempt ${4-retries}/3):`, err);
            if (retries > 0) {
              // If database has issues, wait and retry
              setTimeout(() => tryInsert(retries - 1), 500);
            } else {
              resolve({ success: false, error: err.message });
            }
          } else {
            resolve({ success: true, id: result.rows[0]?.id });
          }
        }
      );
    };

    tryInsert();
  });
}

// Update last seen timestamp for a device
function updateDeviceLastSeen(sessionId, deviceId) {
  return new Promise((resolve, reject) => {
    if (!sessionId || !deviceId) {
      return resolve({ success: false });
    }

    pool.query(
      `UPDATE devices SET last_seen = CURRENT_TIMESTAMP 
       WHERE session_id = $1 AND device_id = $2`,
      [sessionId, deviceId],
      (err, result) => {
        if (err) {
          console.error('Error updating device last seen:', err);
          return resolve({ success: false });
        }
        resolve({ success: result.rowCount > 0 });
      }
    );
  });
}

// Clean up expired sessions and their associated devices
function cleanupExpiredSessions() {
  // This function should be called periodically, not on every request
  pool.query(`
    DELETE FROM devices 
    WHERE session_id NOT IN (
      SELECT sid FROM sessions
    )
  `, (err) => {
    if (err) {
      console.error('Error cleaning up expired sessions:', err);
    }
  });
}

process.on('exit', () => {
  // Close pool when the application exits
  pool.end(() => {
    console.log('Pool has ended');
  });
});

module.exports = {
  pool,
  configureSessionStore,
  getDeviceCount,
  getDevices,
  getDeviceLocations,
  getSessionsForUser,
  getDevicesForSessions,
  invalidateDevice,
  addDevice,
  updateDeviceLastSeen,
  cleanupExpiredSessions
};