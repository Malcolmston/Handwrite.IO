const express = require('express');
const passport = require('passport');
const WebAuthnStrategy = require('passport-fido2-webauthn');
const SessionChallengeStore = require('passport-fido2-webauthn').SessionChallengeStore;
const base64url = require('base64url');
const uuid = require('uuid').v4;
const { User, Key } = require('./account/models');
const sequelize = require('./account/db');

const jwt = require('jsonwebtoken');

const store = new SessionChallengeStore();

// WebAuthn Strategy Configuration
passport.use(new WebAuthnStrategy(
  {
    store: store,
    rpName: "Handwrite.IO",
    rpId: undefined,
    userVerification: "required",
    timeout: 60000
  },
  // Verify function
  async function verify(id, userHandle, cb) {
    try {
      const key = await Key.findOne({
        where: { externalId: id },
        include: [{ model: User }]
      });


      if( !key) {
        cb(null, false, {message: 'User does not exist'});
      }

      return cb(null, key.User.toJSON(), key.Key);
    } catch (err) {
      return cb(err);
    }
  },
  // Register function
  async function register(user, id, publicKey, cb) {
    const transaction = await sequelize.transaction();
    try {
      const [newUser, created] = await User.findOrCreate({
        where: { username: user.name },
        defaults: {
          firstname: user.displayName.split(' ')[0],
          lastname: user.displayName.split(' ')[1] || '',
          handle: Buffer.from(uuid(), 'utf8')
        },
        transaction
      });

      const [key, keyCreated] = await Key.findOrCreate({
        where: { userId: newUser.id },
        defaults: {
          Key: Buffer.from(publicKey),
          externalId: id,
          userId: newUser.id
        },
        transaction
      });

      if (!keyCreated) {
        await key.update({ Key: Buffer.from(publicKey) }, { transaction });
      }

      await transaction.commit();
      return cb(null, newUser);
    } catch (error) {
      await transaction.rollback();
      return cb(error);
    }
  }
));

// Passport serialization
passport.serializeUser((user, cb) => {
  process.nextTick(() => {
    cb(null, {
      id: user.id,
      username: user.username,
      name: `${user.firstname} ${user.lastname}`.trim()
    });
  });
});

passport.deserializeUser((user, cb) => {
  process.nextTick(() => cb(null, user));
});

// Router setup
const router = express.Router();

// Login routes
router.post('/login/public-key/challenge', (req, res, next) => {
  store.challenge(req, (err, challenge) => {
    if (err) return next(err);

    res.json({
      challenge: base64url.encode(challenge),
      rpId: req.hostname,
      userVerification: "required",
      timeout: 60000
    });
  });
});

router.post('/login/public-key',
  passport.authenticate('webauthn', { failWithError: true }),
  (req, res) => {
    // Set session data
    req.session.username = req.user.username;
    req.session.type = req.user.type;
    req.session.valid = true;

    // Save session before sending response
    req.session.save((err) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          error: 'Failed to save session'
        });
      }

      // Send response only after session is saved
      res.json({
        ok: true,
        user: {
          username: req.user.username,
          type: req.user.type,
          name: req.user.name
        },
        location: '/dashboard',
        message: 'Authentication successful'
      });
    });
  },
  (err, req, res, next) => {

    if (Math.floor(err.status / 100) !== 4) return next(err);

    res.status(401).json({
      ok: false,
      error: err.message || 'Authentication failed',
      location: '/login'
    });
  }
);

// Signup routes
router.post('/signup/public-key/challenge', async (req, res, next) => {
  const { username, name } = req.body;

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  const handle = uuid({}, Buffer.alloc(16));
  const user = {
    id: handle,
    name: username,
    displayName: name || username
  };

  store.challenge(req, { user }, (err, challenge) => {
    if (err) return next(err);

    res.json({
      user: {
        id: base64url.encode(user.id),
        name: user.name,
        displayName: user.displayName
      },
      challenge: base64url.encode(challenge),
      rp: {
        name: "Handwrite.IO",
        id: req.hostname
      },
      pubKeyCredParams: [
        { type: "public-key", alg: -7 },
        { type: "public-key", alg: -257 }
      ],
      authenticatorSelection: {
        authenticatorAttachment: "platform",
        userVerification: "preferred",
        requireResidentKey: false
      },
      timeout: 60000,
      attestation: "direct"
    });
  });
});

router.post('/signup/public-key',
  express.json(),
  passport.authenticate('webauthn', { failWithError: true }),
  (req, res) => {
    // Set session data
    req.session.username = req.user.username;
    req.session.type = req.user.type;
    req.session.valid = true;

    // Save session before sending response
    req.session.save((err) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          error: 'Failed to save session'
        });
      }

      // Send response only after session is saved
      res.json({
        ok: true,
        user: {
          username: req.user.username,
          type: req.user.type,
          name: req.user.name
        },
        message: 'Security key registered successfully',
        location: '/dashboard'
      });
    });
  },
  (err, req, res, next) => {
    if (Math.floor(err.status / 100) !== 4) return next(err);

    res.status(400).json({
      ok: false,
      error: err.message || 'Security key registration failed',
      location: '/signup'
    });
  }
);

module.exports = router;
