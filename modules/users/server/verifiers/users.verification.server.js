'use strict';
const jwt = require('jsonwebtoken');
/**
 * Module dependencies
 */
var path = require('path'),
  cassandra = require('express-cassandra'),
  User = cassandra.instance.Users;

//  Middleware for an existent user
exports.emailExistenceVerification = async(req, res, next) => {
  User.findOne({ username: req.body.username }, { allow_filtering: true },  function(err, user) {
    if(!err && user) return res.status(422).send({ message: 'The provided username already exists' });
    else next();
  });
};

//  Verify if have an existent pair
exports.verifyPairInvitation = async(req, res, next) => {
  if(req.query.user) req.body.pair = jwt.verify(req.query.user, process.env.SECRET_KEY);
  next();
}
