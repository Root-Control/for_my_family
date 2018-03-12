const jwt = require('jsonwebtoken');

module.exports.tokenVerificationMiddleware = async(req, res, next) => {
  let authorization = req.headers.authorization || req.headers.Authorization;
  let decoded;
  let user;
  if (authorization) {
    try {
      decoded = jwt.verify(authorization, process.env.SECRET_KEY);
      req.user = decoded.data;
      next();
    } catch (e) {
      return res.status(500).send('Token Expirado o inválido');
    }
  } else {
  	req.user = undefined;
  	next();
  }
};

module.exports.tokenPolicyVerification = (req) => {
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
      return { success: false };
    }
  } else if(req.query.token) {
    try {
      decoded = jwt.verify(req.query.token, process.env.SECRET_KEY);
      user = decoded.data;
      roles = user.roles;
    } catch (e) {
      return { success: false };
    }    
  } else {
    roles = ['guest'];
  }
  
  return { success: true, data: { user: user, roles: roles }}
};

