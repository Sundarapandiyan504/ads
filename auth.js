// const express = require('express');
// const axios = require('axios');
// const router = express.Router();
// require('dotenv').config();

// const APP_ID = process.env.FACEBOOK_APP_ID;
// const APP_SECRET = process.env.FACEBOOK_APP_SECRET;
// const REDIRECT_URI = process.env.CALLBACK_URL;

// // Initiates the Facebook Login flow
// router.get('/auth/facebook', (req, res) => {
//   const url = `https://www.facebook.com/v13.0/dialog/oauth?client_id=${APP_ID}&redirect_uri=${REDIRECT_URI}&scope=email`;
//   res.redirect(url);
// });

// // Callback URL for handling the Facebook Login response
// router.get('/auth/facebook/callback', async (req, res) => {
//   const { code } = req.query;

//   try {
//     // Exchange authorization code for access token
//     const { data } = await axios.get(`https://graph.facebook.com/v13.0/oauth/access_token?client_id=${APP_ID}&client_secret=${APP_SECRET}&code=${code}&redirect_uri=${REDIRECT_URI}`);

//     const { access_token } = data;

//     // Use access_token to fetch user profile
//     const { data: profile } = await axios.get(`https://graph.facebook.com/v13.0/me?fields=name,email&access_token=${access_token}`);

//     // Code to handle user authentication and retrieval using the profile data

//     res.redirect('/');
//   } catch (error) {
//     console.error('Error:', error.response.data.error);
//     res.redirect('/login');
//   }
// });

// // Logout route
// router.get('/logout', (req, res) => {
//   // Code to handle user logout
//   res.redirect('/login');
// });

// module.exports = router;

const passport = require('passport');
const express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  res.render('views/pages/index.ejs'); // load the index.ejs file
});

router.get('/profile', isLoggedIn, function (req, res) {
  res.render('pages/profile.ejs', {
    user: req.user // get the user out of session and pass to template
  });
});

router.get('/error', isLoggedIn, function (req, res) {
  res.render('pages/error.ejs');
});

router.get('/auth/facebook', passport.authenticate('facebook', {
  scope: ['public_profile', 'email']
}));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/profile',
    failureRedirect: '/error'
  }));

router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/');
}

module.exports = router;