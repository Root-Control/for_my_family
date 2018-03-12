'use strict';
  var path = require('path'),
    verifications = require(path.resolve('./modules/core/security/token-verification.server'));

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
  let verification = verifications.tokenPolicyVerification(req);
  let user;
  let roles;
  if(!verification.success) {
    return res.status(500).send({ message: 'Expired or invalid Token' }); 
  }
  user = verification.data.user;
  roles = verification.data.roles;
  
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
