'use strict';

/**
 * Module dependencies
 */
var passport = require('passport'),
  path = require('path'),
  models = require('express-cassandra'),
  config = require(path.resolve('./config/config'));

/**
 * Module init function
 */
module.exports = function (app) {
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  // Deserialize sessions
  passport.deserializeUser(function (id, done) {
    models.instance.Users.findOne({ id: id }, function (err, user) {
      //  done(err, user);
      done(null, false);
    });
  });

  // Initialize strategies
  config.utils.getGlobbedPaths(path.join(__dirname, './strategies/**/*.js')).forEach(function (strategy) {
    require(path.resolve(strategy))(config);
  });

  // Add passport's middleware
  app.use(passport.initialize());
  app.use(passport.session());
};
