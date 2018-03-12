'use strict';

/**
 * Module dependencies
 */
var passport = require('passport'),
  path = require('path'),
  LocalStrategy = require('passport-local').Strategy,
  models = require('express-cassandra'),
  authMiddleware = require(path.resolve('./modules/core/security/password-security.server'));
module.exports = function () {
  // Use local strategy
  passport.use(new LocalStrategy({
    usernameField: 'usernameOrEmail',
    passwordField: 'password'
  },
  async (usernameOrEmail, password, done) => {
    //  models.instance.Articles.find({}, { allow_filtering: true }, (err, articles) => {
    models.instance.Users.findOne({ username: usernameOrEmail.toLowerCase() }, { allow_filtering: true }, async (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user || !await authMiddleware.authenticate(password, user.password)) {
        return done(null, false, {
          message: 'Invalid username or password (' + (new Date()).toLocaleTimeString() + ')'
        });
      }
      console.log('logged');
      return done(null, user);

    });
  }));
};
