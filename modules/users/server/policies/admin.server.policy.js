'use strict';
let path = require('path'),
  verifications = require(path.resolve('./modules/core/security/token-verification.server'));

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
  let verification = verifications.tokenPolicyVerification(req);
  let user;
  let roles;
  if (!verification.success) {
    return res.status(500).send({ message: 'Expired or invalid Token' });
  }
  user = verification.data.user;
  roles = verification.data.roles;

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
