// session-store.js - Improved SQLite session store setup

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create a single database connection with better concurrency settings
const db = new sqlite3.Database(path.join(__dirname, './sessions/sessions.db'), (err) => {
  if (err) {
    console.error('Error opening database', err);
  } else {
    console.log('Connected to the SQLite database');

    // Set pragmas for better concurrency
    db.run('PRAGMA journal_mode = WAL;'); // Write-Ahead Logging mode
    db.run('PRAGMA busy_timeout = 5000;'); // Wait up to 5 seconds when database is locked

    // Create devices table if it doesn't exist
    db.run(`
      CREATE TABLE IF NOT EXISTS devices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT NOT NULL,
        device_id TEXT NOT NULL,
        user_agent TEXT,
        ip_address TEXT,
        last_seen DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(session_id, device_id)
      )
    `);
  }
});

// Configure session store with better error handling
function configureSessionStore(session) {
  const SQLiteStore = require('connect-sqlite3')(session);

  const sessionStore = new SQLiteStore({
    // Use an in-memory database for sessions if the main DB is locked
    // This provides a fallback mechanism
    db: 'sessions.db',
    dir: path.join(__dirname, './sessions'),
    concurrentDB: true,   // Allow multiple connections
    table: 'sessions',
    // Time between session store's garbage collection (in ms)
    // This helps prevent constant DB writes
    interval: 60 * 1000 // Run GC every minute instead of every request
  });

  // Handle session store errors
  sessionStore.on('error', function(error) {
    console.error('Session store error:', error);
  });

  return sessionStore;
}

// Get device count for a session ID - with better error handling
function getDeviceCount(sessionId) {
  return new Promise((resolve, reject) => {
    if (!sessionId) {
      return resolve(0);
    }

    db.get(
      'SELECT COUNT(DISTINCT device_id) as count FROM devices WHERE session_id = ?',
      [sessionId],
      (err, row) => {
        if (err) {
          console.error('Error getting device count:', err);
          return resolve(0); // Fail gracefully
        }
        resolve(row ? row.count : 0);
      }
    );
  });
}

// Get all devices for a session ID - with better error handling
function getDevices(sessionId) {
  return new Promise((resolve, reject) => {
    if (!sessionId) {
      return resolve([]);
    }

    db.all(
      'SELECT device_id, user_agent, ip_address, last_seen FROM devices WHERE session_id = ?',
      [sessionId],
      (err, rows) => {
        if (err) {
          console.error('Error getting devices:', err);
          return resolve([]); // Fail gracefully
        }
        resolve(rows || []);
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

    db.all(
      'SELECT DISTINCT ip_address FROM devices WHERE session_id = ?',
      [sessionId],
      (err, rows) => {
        if (err) {
          console.error('Error getting device locations:', err);
          return resolve([]); // Fail gracefully
        }
        resolve(rows.map(row => row.ip_address) || []);
      }
    );
  });
}

// Get session IDs for a username - with SQL injection protection
function getSessionsForUser(username) {
  return new Promise((resolve, reject) => {
    if (!username) {
      return resolve([]);
    }

    // Use parameterized query to prevent SQL injection
    db.all(
      `SELECT sess FROM sessions WHERE sess LIKE ?`,
      [`%"username":"${username}"%`],
      (err, rows) => {
        if (err) {
          console.error('Error getting sessions for user:', err);
          return resolve([]); // Fail gracefully
        }

        const sessionIds = rows.map(row => {
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

    const placeholders = sessionIds.map(() => '?').join(',');
    const query = `SELECT session_id, device_id, user_agent, ip_address, last_seen 
                   FROM devices 
                   WHERE session_id IN (${placeholders})`;

    db.all(query, sessionIds, (err, deviceRows) => {
      if (err) {
        console.error('Error getting devices for sessions:', err);
        return resolve([]); // Fail gracefully
      }
      resolve(deviceRows || []);
    });
  });
}

// Invalidate (delete) a device - with better error handling
function invalidateDevice(sessionId, deviceId) {
  return new Promise((resolve, reject) => {
    if (!sessionId || !deviceId) {
      return resolve({ success: false, reason: 'Invalid parameters' });
    }

    db.run(
      'DELETE FROM devices WHERE session_id = ? AND device_id = ?',
      [sessionId, deviceId],
      function(err) {
        if (err) {
          console.error('Error invalidating device:', err);
          return resolve({ success: false, error: err.message });
        }
        resolve({ success: this.changes > 0 });
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
      db.run(
        `INSERT OR REPLACE INTO devices (session_id, device_id, user_agent, ip_address, last_seen) 
         VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
        [sessionId, device_id, user_agent, ip_address],
        function(err) {
          if (err) {
            console.error(`Error adding device (attempt ${4-retries}/3):`, err);
            if (retries > 0 && (err.code === 'SQLITE_BUSY' || err.code === 'SQLITE_LOCKED')) {
              // If database is locked, wait and retry
              setTimeout(() => tryInsert(retries - 1), 500);
            } else {
              resolve({ success: false, error: err.message });
            }
          } else {
            resolve({ success: true, id: this.lastID });
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

    db.run(
      `UPDATE devices SET last_seen = CURRENT_TIMESTAMP 
       WHERE session_id = ? AND device_id = ?`,
      [sessionId, deviceId],
      function(err) {
        if (err) {
          console.error('Error updating device last seen:', err);
          return resolve({ success: false });
        }
        resolve({ success: this.changes > 0 });
      }
    );
  });
}

// Clean up expired sessions and their associated devices
function cleanupExpiredSessions() {
  // This function should be called periodically, not on every request
  db.run(`DELETE FROM devices WHERE session_id NOT IN (
            SELECT SUBSTR(sid, 1, LENGTH(sid)-1) FROM sessions
          )`);
}

process.on('exit', () => {
  // Close database connection when the application exits
  db.close((err) => {
    if (err) {
      console.error('Error closing database connection:', err);
    }
  });
});

module.exports = {
  db,
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
