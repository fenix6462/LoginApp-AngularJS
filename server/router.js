var AuthenticationController = require('./controllers/authentication');
var express = require('express');
var passportService = require('./config/passport');
var passport = require('passport');

// Middleware to require login/auth
var requireAuth = passport.authenticate('jwt', { session: false });  
var requireLogin = passport.authenticate('local', { session: false });

// Constants for role types
const REQUIRE_ADMIN = "Admin",  
      REQUIRE_OWNER = "Owner",
      REQUIRE_CLIENT = "Client",
      REQUIRE_MEMBER = "Member";

module.exports = function(app) {  
  // Initializing route groups
  var apiRoutes = express.Router();
  var authRoutes = express.Router();

  //=========================
  // Auth Routes
  //=========================

  // Set auth routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/auth', authRoutes);

  // Registration route
  authRoutes.post('/register', AuthenticationController.register);

  // Login route
  authRoutes.post('/login', requireLogin, AuthenticationController.login);
  
// Set url for API group routes
  app.use('/api', apiRoutes);
};