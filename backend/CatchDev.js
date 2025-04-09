const express = require('express');
const router = express.Router();
const session = require('express-session');
const crypto = require("crypto");
const sessionStoreUtils = require('./Session');

const SESSION_SECRET_KEY = process.env.SESSION_SECRET_KEY;

// Create session store using PostgreSQL
const sessionStore = sessionStoreUtils.configureSessionStore(session);

// Function to generate a device ID
function generateDeviceId(deviceInfo) {
  return crypto.createHash('md5')
    .update(deviceInfo.userAgent + deviceInfo.ipAddress)
    .digest('hex');
}

// Function to track a device
function trackDevice(sessionId, deviceId, deviceInfo) {
  sessionStoreUtils.addDevice(sessionId, {
    device_id: deviceId,
    user_agent: deviceInfo.userAgent,
    ip_address: deviceInfo.ipAddress
  })
  .then(result => {
    if (!result.success) {
      console.error('Error tracking device:', result.error || result.reason);
    }
  })
  .catch(err => {
    console.error('Exception tracking device:', err);
  });
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