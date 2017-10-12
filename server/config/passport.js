// Importing Passport, strategies, and config
var passport = require('passport');
var User = require('../models/user');
var config = require('./main');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var LocalStrategy = require('passport-local');

// Setting username field to email rather than username
var localOptions = {
  usernameField: 'email'
};

// Setting up local login strategy
var localLogin = new LocalStrategy(localOptions, (email, password, done) => {
  User.findOne({ email }, (err, user) => {
    if (err) { return done(err); }
    if (!user) { return done(null, false, { error: 'Your login details could not be verified. Please try again.' }); }

    user.comparePassword(password, (err, isMatch) => {
      if (err) { return done(err); }
      if (!isMatch) { return done(null, false, { error: 'Your login details could not be verified. Please try again.' }); }

      return done(null, user);
    });
  });
});

// Setting JWT strategy options
var jwtOptions = {
  // Telling Passport to check authorization headers for JWT
  jwtFromRequest: ExtractJwt.fromAuthHeader(),
  // Telling Passport where to find the secret
  secretOrKey: config.secret

  // TO-DO: Add issuer and audience checks
};

// Setting up JWT login strategy
var jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
	console.log(payload);
  User.findById(payload._id, (err, user) => {
    if (err) { return done(err, false); }

    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});

passport.use(jwtLogin);
passport.use(localLogin);