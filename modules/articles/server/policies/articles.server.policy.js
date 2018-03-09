'use strict';

/**
 * Module dependencies
 */
var acl = require('acl'),
  jwt = require('jsonwebtoken');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Articles Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/articles',
      permissions: '*'
    }, {
      resources: '/api/articles/:articleId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/articles',
      permissions: ['get']
    }, {
      resources: '/api/articles/:articleId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/articles',
      permissions: ['get']
    }, {
      resources: '/api/articles/:articleId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Articles Policy Allows
 */
exports.isAllowed = async (req, res, next) => {
  let authorization = req.headers.authorization || req.headers.Authorization;

  let roles = '';
  let decoded;
  let user;
  if (authorization) {
    try {
      decoded = jwt.verify(authorization.toString(), process.env.SECRET_KEY.toString());
      user = decoded.data;
      roles = user.roles;
    } catch(e) {
        switch(e.message) {
          case 'jwt expired':
            return res.status(401).send({ status: 'Unauthorized', message: e.message });
            break;
          case 'invalid signature':
            return res.status(401).send({ status: 'Unauthorized', message: e.message });
            break;
        }
    }
  } else {
    roles = ['guest'];
  }
  // If an article is being processed and the current user created it then allow any manipulation
  if (req.article && req.user && req.article.user && req.article.user.id === req.user.id) {
    return next();
  }

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
