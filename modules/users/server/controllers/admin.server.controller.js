'use strict';

/**
 * Module dependencies
 */
const path = require('path'),
  mongoose = require('mongoose'),
  cassandra = require('express-cassandra'),
  User = cassandra.instance.Users,
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Show the current user
 */
exports.read = function (req, res) {
  res.json(req.model);
};

/**
 * Update a User
 */
exports.update = function (req, res) {
  let user = req.model;
  let queryObject = { id: user.id };
  // For security purposes only merge these parameters
  let data = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    displayName: req.body.firstName + ' ' + req.body.lastName
  };

  data.isAdmin = parseInt(req.body.isAdmin, 10) || 0;
  if (data.isAdmin) {
    data.roles = JSON.stringify(['admin']);
  } else {
    data.roles = JSON.stringify(['user']);
  }

  User.update(queryObject, data, err => {
    if (err) return res.status(422).send({ message: errorHandler.getErrorMessage(err) });
    res.json(user);
  });
};

/**
 * Delete a user
 */
exports.delete = function (req, res) {
  let user = req.model;

  user.delete(err => {
    if (err) return res.status(422).send({ message: errorHandler.getErrorMessage(err) });
    res.json(user);
  });
};

/**
 * List of Users
 */
exports.list = function (req, res) {
  User.find({}, { allow_filtering: true, raw: true }, (err, users) => {
    console.log(users);
    if (err) return res.status(422).send({ message: errorHandler.getErrorMessage(err) });
    else res.json(users);
  });
};

/**
 * User middleware
 */
exports.userByID = function (req, res, next, id) {
  User.findOne({ id: id }, (err, user) => {
    if (!user) return res.status(404).send({ message: 'No user with that identifier has been found' });
    req.model = user;
    next();
  });
};
