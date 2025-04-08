const express = require('express');
const router = express.Router();
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const crypto = require("crypto");
const sessionStoreUtils = require('./Session');
const { db } = require("./Session");
const { base64ToBlob } = require("./base64ToBlob.js");

const SESSION_SECRET_KEY = process.env.SESSION_SECRET_KEY;

// Create session store
const sessionStore = new SQLiteStore({
  dir: './sessions',        // Directory where SQLite db will be saved
  db: 'sessions.db',        // Database filename
  table: 'sessions'         // Table name to use
});

// Function to generate a device ID
function generateDeviceId(deviceInfo) {
  return crypto.createHash('md5')
    .update(deviceInfo.userAgent + deviceInfo.ipAddress)
    .digest('hex');
}

// Function to track a device
function trackDevice(sessionId, deviceId, deviceInfo) {
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO devices (session_id, device_id, user_agent, ip_address, last_seen)
    VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
  `);

  stmt.run(
    sessionId,
    deviceId,
    deviceInfo.userAgent,
    deviceInfo.ipAddress,
    (err) => {
      if (err) console.error('Error tracking device:', err);
    }
  );

  stmt.finalize();
}

// Session middleware configuration
router.use(session({
  secret: SESSION_SECRET_KEY,
  // Only save session if it has been modified
  resave: false,
  // Don't save empty uninitialized sessions - better for privacy and performance
  saveUninitialized: false,
  // Use the session store
  store: sessionStore,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Only use secure cookies in production
    httpOnly: true,  // Prevents client-side access to the cookie
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Middleware to track device connections
router.use((req, res, next) => {
  const sessionId = req.session.id;
  const deviceInfo = {
    userAgent: req.headers['user-agent'],
    ipAddress: req.ip,
    // Add other device identifiers as needed
  };

  // Generate a device ID
  const deviceId = generateDeviceId(deviceInfo);

  // Track this device
  trackDevice(sessionId, deviceId, deviceInfo);

  next();
});

module.exports = router;
