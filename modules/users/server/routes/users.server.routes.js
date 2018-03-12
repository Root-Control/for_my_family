'use strict';

module.exports = function (app) {
  // User Routes
  const users = require('../controllers/users.server.controller'),
    path = require('path'),
    authMiddleware = require(path.resolve('./modules/core/security/password-security.server')),
    verifications = require(path.resolve('./modules/core/security/token-verification.server'));

  // Setting up the users profile api
  app.route('/api/users/me').get(users.me);
  app.route('/api/users').put(verifications.tokenVerificationMiddleware, users.update);
  app.route('/api/users/accounts').delete(users.removeOAuthProvider);
  app.route('/api/users/password').post(verifications.tokenVerificationMiddleware, authMiddleware.userPresave, users.changePassword);
  app.route('/api/users/picture').post(verifications.tokenVerificationMiddleware, users.changeProfilePicture);

  // Finish by binding the user middleware
  app.param('userId', users.userByID);
};
