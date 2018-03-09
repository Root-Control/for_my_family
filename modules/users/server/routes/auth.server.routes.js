'use strict';

/**
 * Module dependencies
 */
var passport = require('passport');

module.exports = function (app) {
  // User Routes
  var users = require('../controllers/users.server.controller'),
    path = require('path'),
    authMiddleware = require(path.resolve('./modules/core/security/password-security.server'));

  // Setting up the users password api

  //  Routes for develop
  //  app.route('/api/auth/forgot').post(users.forgot);
  //  app.route('/api/auth/reset/:token').get(users.validateResetToken);
  //  app.route('/api/auth/reset/:token').post(users.reset);

  // Setting up the users authentication api
  //  app.route('/api/auth/signin').post(authMiddleware.authenticate, users.signin);

  app.route('/api/auth/signup').post(authMiddleware.userPresave, users.signup);
  app.route('/api/auth/signin').post(users.signin);
  app.route('/api/auth/signout').get(users.signout);

  // Setting the oauth routes
  app.route('/api/auth/:strategy').get(users.oauthCall);
  app.route('/api/auth/:strategy/callback').get(users.oauthCallback);

};
