'use strict';

/**
 * Module dependencies
 */
var _ = require('lodash'),
  mongoose = require('mongoose'),
  models = require('express-cassandra');

/**
 * User middleware
 */
exports.userByID = function (req, res, next, id) {
  models.instance.Users.findOne({ id: id }, (err, user) => {
    if (err) {
      return next(err);
    } else if (!user) {
      return next(new Error('Failed to load User ' + id));
    }
    req.profile = user;
    next();
  });
};
