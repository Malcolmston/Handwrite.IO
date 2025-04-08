const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const path = require('path');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');
const cors = require('cors');
const oath = require("./sendOath");
const {User, Key, Subscriber, SchoolUser} = require('./account/models');
const { comparePassword, verifyImageSignature } = require('./account/password');
const TOTP = require("./TOPC");
const {OAuth2Client} = require('google-auth-library');

const sessionRoute = require("./CatchDev");
const touch = require("./touchless")


require('dotenv').config();

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET;
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET
};

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const IOS_CLIENT_ID = process.env.GOOGLE_IOS_CLIENT_ID;
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('trust proxy', 1);

app.use(sessionRoute)

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true // This allows cookies to be sent with the request
}));

app.use("/oath", oath);
app.use("/", touch)

// Configure Passport JWT strategy
passport.use(new JwtStrategy(jwtOptions, async (jwt_payload, done) => {
  try {
    // Find user by id from the jwt payload
    const user = await User.findByPk(jwt_payload.id);

    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (error) {
    return done(error, false);
  }
}));

// Initialize Passport
app.use(passport.initialize());

// Authentication middleware
const authenticate = passport.authenticate('jwt', { session: false });

// Login route
app.post("/login", async (req, res) => {
  const {username, password, token} = req.body;

  try {
    let user = await User.findOne({
      where: {username},
      raw: false, // Changed to false to get a full Sequelize model instance
      paranoid: true
    });

    if(!user) {
      return res.status(400).json({
        success: false,
        message: 'No user found.'
      });
    }

    if(!user.password && !!user.googleId) {
      return res.status(405).json({
        success: false,
        message: 'Sign in with Google'
      });
    }

    if(user.deletedAt) {
      return res.status(400).json({
        success: false,
        message: 'User has been deleted'
      });
    }

    // Check if this is a 2FA verification request (token provided, no password)
    const is2FAVerification = token && !password && user.totpEnabled;

    // Only verify password if this is not a 2FA verification step
    if (!is2FAVerification) {
      let match = comparePassword(password, user.password);
      if(!match) {
        return res.status(400).json({
          success: false,
          message: 'Invalid password'
        });
      }
    }

    // Check if 2FA is enabled
    if (user.totpEnabled) {
      // If no token provided but 2FA is enabled, prompt for token
      if (!token) {
        return res.status(200).json({
          success: true,
          message: "Please enter your 2FA verification code",
          requiresTOTP: true
        });
      }

      // Verify the token
      const totp = new TOTP(user.totpSecret);

      const isValid = totp.verifyTOTP(token);

      if (!isValid) {
        return res.status(401).json({
          success: false,
          message: "Invalid verification code. Please try again."
        });
      }
    }

    // Create token payload (don't include sensitive info like passwords)
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      type: user.type,
      totpEnabled: user.totpEnabled || false
    };

    // Sign the JWT token
    const signedToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

    // Set session data
    req.session.username = user.username;
    req.session.type = user.type;
    req.session.valid = true;
    req.session.totpEnabled = user.totpEnabled;


    // Save session before redirect
    req.session.save((err) => {
      if(err) {
        return res.status(500).json({
          message: "Error saving session",
          success: false
        });
      }
      return res.json({
        success: true,
        token: `Bearer ${signedToken}`,
        redirect: '/dashboard'
      });

    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Signup route
app.post("/signup", async (req, res) => {
  const {firstname, lastname, email, username, password} = req.body;

  try {
    let user = await User.findOne({
      where: {username},
      raw: true,
      paranoid: true
    });

    if(user) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    if(user && user.deletedAt) {
      return res.status(400).json({
        success: false,
        message: 'User has been deleted'
      });
    }

    let newUser = await User.create({
      firstname,
      lastname,
      email,
      username,
      password
    });

    // Create token payload
    const payload = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      type: newUser.type,
      totpEnabled: false
    };

    // Sign the JWT token
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

    // Set session data
    req.session.username = newUser.username;
    req.session.type = newUser.type;
    req.session.valid = true;

    req.session.save((err) => {
      if(err) {
        return res.status(500).json({
          success: false,
          message: 'Unable to save session',
        });
      }

      return res.json({
        success: true,
        token: `Bearer ${token}`,
        redirect: '/dashboard'
      });

    });



  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

app.get("/getsession", async (req, res) => {
  // Check if user is authenticated


  if (req.session.passport.user.username  || req.session.passport.username ) {
    try {
      let {username, id} = (req.session.passport.user || req.session.passport)

      let user = await User.findByPk(id, {
        raw: false,
        passport: true
      })

      if(!user) {
        return res.status(400).json({
          success: false,
          message: 'No user found.'
        });
      } else if(user.username !== username) {
        return res.status(401).json({
          ok: false,
          error: 'User does not exist'
        })
      } else if(user.deletedAt) {
        return res.status(400).json({
          success: false,
          message: 'User has been deleted'
        });
      } else {
        // Create token payload (don't include sensitive info like passwords)
        const payload = {
          id: user.id,
          username: user.username,
          email: user.email,
          type: user.type,
          totpEnabled: user.totpEnabled || false
        };

        // Sign the JWT token
        const signedToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

        return res.json({
          success: true,
          token: `Bearer ${signedToken}`,
          redirect: '/dashboard'
        });
      }
    } catch (e) {
      return res.status(500).json({
        success: false,
        message: e.message
      })
    }

  } else {
    // User is not authenticated
    return res.status(200).json({
      authenticated: false,
      message: "No active session found"
    });
  }
});


// Google OAuth callback
app.post('/google/callback', async (req, res) => {
  try {
    const { idToken, mode } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: 'Missing idToken in request body'
      });
    }

    // Verify the Google ID token
    let ticket;
    try {
      ticket = await googleClient.verifyIdToken({
        idToken: idToken,
        audience: [
          GOOGLE_CLIENT_ID,
          IOS_CLIENT_ID
        ]
      });
    } catch (verifyError) {
      console.error('Error verifying Google token:', verifyError);
      return res.status(401).json({
        success: false,
        message: 'Invalid Google token: ' + verifyError.message
      });
    }

    const payload = ticket.getPayload();
    const googleId = payload['sub'];
    const email = payload['email'];
    const firstname = payload['given_name'] || '';
    const lastname = payload['family_name'] || '';
    const picture = payload['picture'];

    // Use the mode to determine if this is a login or signup
    const isSignup = mode === 'signup';

    // Find user by Google ID
    let user = await User.findOne({
      where: { googleId: googleId },
      raw: false
    });

    if (user) {
      // User exists, update their profile information
      user.firstname = firstname;
      user.lastname = lastname;
      await user.save();

      // Create token payload
      const tokenPayload = {
        id: user.id,
        username: user.username,
        email: user.email,
        type: user.type,
        totpEnabled: user.totpEnabled
      };

      // Sign the JWT token
      const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '24h' });

      return res.json({
        success: true,
        token: `Bearer ${token}`,
        redirect: '/dashboard'
      });
    }
    else if (email) {
      // Check if user exists with this email
      user = await User.findOne({
        where: { email: email },
        raw: false
      });

      if (user) {
        // User exists with this email, link Google account
        user.googleId = googleId;
        user.firstname = firstname;
        user.lastname = lastname;
        await user.save();

        // Create token payload
        const tokenPayload = {
          id: user.id,
          username: user.username,
          email: user.email,
          type: user.type,
          totpEnabled: user.totpEnabled
        };

        // Sign the JWT token
        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '24h' });

        return res.json({
          success: true,
          token: `Bearer ${token}`,
          redirect: '/dashboard'
        });
      }
      else if (isSignup) {
        // Create a new user if this is a signup request
        let username = email.split('@')[0] + Math.floor(Math.random() * 1000);

        // Check if the user was deleted (soft delete)
        const deletedUser = await User.findOne({
          where: { email: email },
          paranoid: false
        });

        if (deletedUser && deletedUser.deletedAt !== null) {
          return res.status(400).json({
            success: false,
            message: 'This account was previously deleted. Please contact support for assistance.'
          });
        }

        // Check for existing username to avoid conflicts
        const existingUsername = await User.findOne({ where: { username: username } });

        if (existingUsername) {
          // If username exists, add more random characters
          username = username + Math.floor(Math.random() * 10000);
        }

        try {
          // Create the new user
          const newUser = await User.create({
            username: username,
            email: email,
            firstname: firstname,
            lastname: lastname,
            googleId: googleId,
            type: 'basic'  // Default type
          });

          // Create token payload
          const tokenPayload = {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            type: newUser.type,
            totpEnabled: false
          };

          // Sign the JWT token
          const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '24h' });

          return res.json({
            success: true,
            token: `Bearer ${token}`,
            redirect: '/dashboard'
          });
        } catch (createError) {
          console.error('Error creating user:', createError);

          // Check for unique constraint violations
          if (createError.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
              success: false,
              message: 'An account with this email or username already exists.'
            });
          }

          return res.status(500).json({
            success: false,
            message: 'Server error occurred during registration'
          });
        }
      }
      else {
        // This is a login request but user doesn't exist
        return res.status(401).json({
          success: false,
          message: 'No account found with this Google account. Please sign up first.'
        });
      }
    }
    else {
      // No email found in the Google profile
      return res.status(400).json({
        success: false,
        message: 'Google account does not have an associated email.'
      });
    }
  } catch (error) {
    console.error('Error in Google authentication:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process Google authentication: ' + error.message
    });
  }
});

// Protected route that requires authentication
app.get("/dashboard", authenticate, async (req, res) => {
  console.table(req.session.user);
  try {
    // User is already authenticated via the 'authenticate' middleware
    const user = await User.findOne({
      where: { id: req.user.id },
      attributes: {
        exclude: ["password"]
      },
      include: [
        {
          model: Key,
          attributes: ['id'],  // We only need to know if it exists
        },
        {
          model: Subscriber,
          required: false  // LEFT JOIN to still get users without subscriptions
        }
      ],
      paranoid: true
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user is a school user
    let schoolUser = await SchoolUser.findOne({
      where: {
        userId: user.id
      }
    });

    if (schoolUser) {
      return res.status(200).json({
        success: true,
        redirect: "school/dashboard"
      });
    }

    // Prepare dashboard data
    const dashboardData = {
      success: true,
      message: 'Dashboard data retrieved successfully',
      user: {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        name: `${user.firstname} ${user.lastname}`,
        email: user.email,
        username: user.username,
        created: user.createdAt,
        lastPsw: user.lastPsw,
        type: user.type,
        hasFingerprint: user.Key?.id >= 1 || false,
        isSubscribed: user.Subscribers?.length > 0,
        isPro: user.pro,
        extra: [],
        // Add TOTP status from the JWT payload (embedded in req.user) or the user model
        totpEnabled: req.user.totpEnabled || user.totpEnabled || false
      }
    };

    // Add subscriber information if user is pro
    if (dashboardData.user.isPro || (user.Subscriptions && user.Subscriptions.length > 0)) {
      user.Subscriptions?.forEach((subscriber) => {
        let extra = {
          price: subscriber.price,
          didPay: subscriber.didPay,
          startDate: subscriber.startDate,
        };
        dashboardData.user.extra.push(extra);
      });
    }

    // Add getTimeString utility function as a separate method
    dashboardData.getTimeString = function(lastChange, createTime) {
      if (createTime === null || lastChange === null) return "No changes";

      // Convert string dates to Date objects if needed
      if (typeof lastChange === 'string') lastChange = new Date(lastChange);
      if (typeof createTime === 'string') createTime = new Date(createTime);

      // Check which date is earlier and set variables accordingly
      const earlier = lastChange > createTime ? createTime : lastChange;
      const later = lastChange > createTime ? lastChange : createTime;
      const direction = lastChange > createTime ? "ago" : "from now";

      // Calculate differences
      const yearDiff = later.getFullYear() - earlier.getFullYear();
      const monthDiff = later.getMonth() - earlier.getMonth() + (yearDiff * 12);
      const dayDiff = Math.floor((later - earlier) / (1000 * 60 * 60 * 24));
      const hourDiff = Math.floor((later - earlier) / (1000 * 60 * 60));
      const minuteDiff = Math.floor((later - earlier) / (1000 * 60));

      // Format the output based on the most significant time difference
      if (yearDiff > 0) {
        return `around ${yearDiff} ${yearDiff === 1 ? 'year' : 'years'} ${direction}`;
      } else if (monthDiff > 0) {
        return `around ${monthDiff} ${monthDiff === 1 ? 'month' : 'months'} ${direction}`;
      } else if (dayDiff > 7) {
        const weeks = Math.floor(dayDiff / 7);
        return `around ${weeks} ${weeks === 1 ? 'week' : 'weeks'} ${direction}`;
      } else if (dayDiff > 0) {
        return `around ${dayDiff} ${dayDiff === 1 ? 'day' : 'days'} ${direction}`;
      } else if (hourDiff > 0) {
        return `around ${hourDiff} ${hourDiff === 1 ? 'hour' : 'hours'} ${direction}`;
      } else if (minuteDiff > 0) {
        return `around ${minuteDiff} ${minuteDiff === 1 ? 'minute' : 'minutes'} ${direction}`;
      } else {
        return "just now";
      }
    };

    // Since we're using JSON API instead of rendering a template,
    // we'll convert the getTimeString to a string value for key dates
    dashboardData.user.lastPasswordChangeTime = dashboardData.getTimeString(user.lastPsw, user.createdAt);
    dashboardData.user.accountAge = dashboardData.getTimeString(new Date(), user.createdAt);

    // Remove the function since it can't be serialized to JSON
    delete dashboardData.getTimeString;

    res.status(200).json(dashboardData);

  } catch (error) {
    console.error('Dashboard loading error:', error);
    res.status(500).json({
      success: false,
      message: "Error loading dashboard",
      error: error.message
    });
  }
});

app.get("/:username.png",async (req, res) => {
  const username = req.params.username;

  // Check if user exists
  if (!username) {
    return res.status(404).json({
      message: "user not found",
      ok: false
    });
  }

  try {
    let user = await User.findOne({
      where: {
        username: username
      },
      paranoid: true
    })

    if( !user ) {
      return res.status(404).json({
        message: "user not found",
        ok: false
      })
    } else if(user.deletedAt) {
      return res.status(401).json({
        message: "user deleted",
        ok: false
      })
    }


    // Set appropriate content type for a PNG image
    res.set('Content-Type', 'image/png');

    // Send the avatar binary data directly
    return res.status(200).send(user.avatar);

  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message
    })
  }




})


// Handling 404 errors
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
