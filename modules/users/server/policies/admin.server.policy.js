'use strict';
var jwt = require('jsonwebtoken');

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Admin Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/users',
      permissions: '*'
    }, {
      resources: '/api/users/:userId',
      permissions: '*'
    }]
  }]);
};

/**
 * Check If Admin Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  let authorization = req.headers.authorization || req.headers.Authorization;
  let roles = '';
  let decoded;
  let user;
  if (authorization) {
    try {
      decoded = jwt.verify(authorization, process.env.SECRET_KEY);
      user = decoded.data;
      roles = user.roles;
    } catch (e) {
      return res.status(500).send('Token Expirado o inválido');
    }
  } else {
    roles = ['guest'];
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
