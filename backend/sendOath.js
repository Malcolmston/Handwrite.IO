// Fixed routes/sendOath.js file

const TOTP = require('./TOPC.js'); // Make sure this path is correct
const QRCode = require('qrcode');
const express = require("express");

const {User} = require('./account/models');

const oath = express.Router();

// Session middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.valid) {
    return next();
  }
  res.redirect('/account');
};

// Add a test route to verify template rendering
oath.get('/test-2fa', (req, res) => {
  // Hardcoded test data for debugging
  const testData = {
    username: 'testuser',
    qrCodeDataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
    manualEntryKey: 'TEST123456',
    message: null
  };

  console.log('Rendering test-2fa with data:', testData);

  res.render('setup-2fa', testData);
});

// Get TOTP setup page
oath.get('/setup-2fa', isAuthenticated, async (req, res) => {
  try {
    const username = req.session.username;

    const user = await User.findOne({
      where: { username },
      attributes: ['id', 'username', 'email', 'totpEnabled', 'totpTempSecret']
    });

    if (!user) {
      return res.status(404).render('oath', {
        message: 'User not found',
        ok: false,
        type: 'login'
      });
    }

    // If 2FA is already enabled, show the management page
    if (user.totpEnabled) {
      return res.render('./2fa/manage-2fa', {
        username: user.username,
        totpEnabled: true,
        message: null
      });
    }

    // Generate a new TOTP secret if needed
    let totpTempSecret = user.totpTempSecret;

    if (!totpTempSecret) {
      const totp = new TOTP();
      totpTempSecret = totp.secret;

      // Save the temporary secret
      await User.update(
        { totpTempSecret: totpTempSecret },
        { where: { username } }
      );
    }

    // Generate QR code
    const totp = new TOTP(totpTempSecret);
    const otpAuthUrl = totp.getOTPAuthURL(user.username, 'YourAppName');

    // Generate the QR code data URL
    let qrCodeDataUrl;
    try {
      qrCodeDataUrl = await QRCode.toDataURL(otpAuthUrl);
    } catch (err) {
      console.error('QR code generation failed:', err);
      qrCodeDataUrl = null;
    }

    // Prepare template data
    const templateData = {
      username: user.username,
      qrCodeDataUrl: qrCodeDataUrl,
      manualEntryKey: totp.getManualSetupKey(),
      message: null
    };

    console.log('Rendering setup-2fa with data:', {
      username: templateData.username,
      qrCodeAvailable: !!templateData.qrCodeDataUrl,
      manualKeyAvailable: !!templateData.manualEntryKey
    });

    res.render('setup-2fa', templateData);

  } catch (error) {
    console.error('2FA setup error:', error);
    res.status(500).render('oath', {
      message: 'Error setting up 2FA: ' + error.message,
      ok: false,
      type: 'login'
    });
  }
});

// Verify and enable TOTP
oath.post('/enable-2fa', isAuthenticated, async (req, res) => {
  const { token } = req.body;
  const username = req.session.username;

  try {
    // Validate token format (remove any spaces in the token)
    const cleanToken = token.replace(/\s+/g, '');
    if (!cleanToken || !/^\d{6}$/.test(cleanToken)) {
      // Regenerate the QR code for rendering the error page
      const user = await User.findOne({
        where: { username },
        attributes: ['username', 'totpTempSecret']
      });

      if (!user || !user.totpTempSecret) {
        return res.status(400).render('setup-2fa', {
          message: 'TOTP setup not initiated properly',
          error: true,
          username: username,
          qrCodeDataUrl: null,
          manualEntryKey: null
        });
      }

      const totp = new TOTP(user.totpTempSecret);
      const otpAuthUrl = totp.getOTPAuthURL(user.username, 'YourAppName');
      const qrCodeDataUrl = await QRCode.toDataURL(otpAuthUrl);

      return res.status(400).render('setup-2fa', {
        message: 'Invalid token format. Must be 6 digits.',
        error: true,
        username: username,
        qrCodeDataUrl: qrCodeDataUrl,
        manualEntryKey: totp.getManualSetupKey()
      });
    }

    // Get user and temp secret
    const user = await User.findOne({
      where: { username },
      attributes: ['id', 'username', 'email', 'totpEnabled', 'totpTempSecret']
    });

    if (!user || !user.totpTempSecret) {
      return res.status(400).render('setup-2fa', {
        message: 'TOTP setup not initiated properly',
        error: true,
        username: username,
        qrCodeDataUrl: null,
        manualEntryKey: null
      });
    }

    // Verify the token
    const totp = new TOTP(user.totpTempSecret);
    const isValid = totp.verifyTOTP(cleanToken);

    if (!isValid) {
      // Regenerate the QR code for the error page
      const otpAuthUrl = totp.getOTPAuthURL(user.username, 'YourAppName');
      const qrCodeDataUrl = await QRCode.toDataURL(otpAuthUrl);

      return res.status(400).render('setup-2fa', {
        message: 'Invalid verification code. Please try again.',
        error: true,
        username: username,
        qrCodeDataUrl: qrCodeDataUrl,
        manualEntryKey: totp.getManualSetupKey()
      });
    }

    // Enable TOTP for the user
    await User.update(
      {
        totpSecret: user.totpTempSecret,
        totpEnabled: true,
        totpTempSecret: null  // Clear temp secret
      },
      { where: { username } }
    );

    // Update session to indicate 2FA is enabled
    req.session.totpEnabled = true;

    // Redirect to dashboard with success message
    req.session.message = '2FA has been successfully enabled for your account';
    res.redirect('/dashboard');

  } catch (error) {
    console.error('2FA enabling error:', error);
    res.status(500).render('setup-2fa', {
      message: 'Error enabling 2FA: ' + error.message,
      error: true,
      username: username || 'unknown',
      qrCodeDataUrl: null,
      manualEntryKey: null
    });
  }
});

// Disable TOTP
oath.post('/disable-2fa', isAuthenticated, async (req, res) => {
  const { token } = req.body;
  const username = req.session.username;

  try {
    // Validate token format (remove any spaces)
    const cleanToken = token.replace(/\s+/g, '');
    if (!cleanToken || !/^\d{6}$/.test(cleanToken)) {
      return res.status(400).render('./2fa/manage-2fa', {
        message: 'Invalid token format. Must be 6 digits.',
        error: true,
        username: username,
        totpEnabled: true
      });
    }

    // Get user
    const user = await User.findOne({
      where: { username },
      attributes: ['id', 'totpSecret', 'totpEnabled']
    });

    if (!user || !user.totpEnabled || !user.totpSecret) {
      return res.status(400).render('./2fa/manage-2fa', {
        message: '2FA is not enabled for your account',
        error: true,
        username: username,
        totpEnabled: false
      });
    }

    // Verify the token
    const totp = new TOTP(user.totpSecret);
    const isValid = totp.verifyTOTP(cleanToken);

    if (!isValid) {
      return res.status(400).render('./2fa/manage-2fa', {
        message: 'Invalid verification code. Please try again.',
        error: true,
        username: username,
        totpEnabled: true
      });
    }

    // Disable TOTP for the user
    await User.update(
      {
        totpSecret: null,
        totpEnabled: false
      },
      { where: { username } }
    );

    // Update session to indicate 2FA is disabled
    req.session.totpEnabled = false;

    // Redirect to dashboard with success message
    req.session.message = '2FA has been successfully disabled for your account';
    res.redirect('/dashboard');

  } catch (error) {
    console.error('2FA disabling error:', error);
    res.status(500).render('./2fa/manage-2fa', {
      message: 'Error disabling 2FA: ' + error.message,
      error: true,
      username: username || 'unknown',
      totpEnabled: true
    });
  }
});

// Verify 2FA token during login
oath.post('/verify-2fa', async (req, res) => {
  const { username, token } = req.body;


  // Clean the token (remove spaces)
  const cleanToken = token.replace(/\s+/g, '');

  try {
    // Get user
    const user = await User.findOne({
      where: { username },
      attributes: ['username', 'type', 'totpSecret', 'totpEnabled'],
      raw: true
    });

    if (!user || !user.totpEnabled || !user.totpSecret) {
      return res.status(400).json({
        ok: false,
        location: "/account/login",
        error: "Invalid request",
      });
    }

    // Verify the token
    const totp = new TOTP(user.totpSecret);
    const isValid = totp.verifyTOTP(cleanToken);

    if (!isValid) {
      return res.status(200).json({
        ok: true,
        location: "/2fa/verify-2fa",
        message: "Invalid verification code. Please try again.",
      });
    }

    // Set session data


    // Save session before redirect

      res.status(200).json({
        ok: true,
        location: "/dashboard",
      })


  } catch (error) {
    console.log(error);

    return res.status(500).json({
      ok: false,
      location: "/account/login",
      error: error.message,
    });
  }
});

// Add a route to handle login from the oath router as needed
oath.post("/login", async (req, res) => {
  // Your existing login logic here
  // Make sure to check for TOTP if enabled
});

module.exports = oath;
