require('dotenv').config();
const express = require('express');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

const app = express();

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: process.env.CALLBACK_URL, 
  profileFields: ['id', 'displayName', 'email', 'photos'] 
},
(accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

app.use(require('express-session')({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get('/auth/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);

app.get('/auth/facebook/callback', 
  (req, res, next) => {
    console.log("Callback route hit");
    next();
  },
  passport.authenticate('facebook', (err, user, info) => {
    if (err) {
      console.error('Error during authentication:', err);
      return res.redirect('/');
    }

    if (!user) {
      console.log('Authentication failed:', info);
      return res.redirect('/'); 
    }

    console.log('User authenticated:', user);

    req.logIn(user, (err) => {
      if (err) {
        console.error('Error logging in user:', err);
        return res.redirect('/');
      }

      console.log("User logged in successfully");
      return res.redirect('/dashboard'); 
    });
  })
);

app.get('/', (req, res) => {
  console.log("Home route accessed");
  res.send('<a href="/auth/facebook">Login with Facebook</a>');
});

app.get('/dashboard', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.send(`<h1>Welcome ${req.user.displayName}</h1><a href="/">Logout</a>`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
