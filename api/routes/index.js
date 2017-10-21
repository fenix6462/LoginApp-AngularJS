var express = require('express');
var router = express.Router();

var authenticationController = require('../controllers/authentication.controller');
var profileController = require('../controllers/profile.controller');

// Auth route
router
  .route('/auth/register')
  .post(authenticationController.register);

router
  .route('/auth/login')
  .post(authenticationController.login);

//Api route
router
  .route('/profile')
  .get(authenticationController.requireAuth, profileController.getProfile);

module.exports = router;