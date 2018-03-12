'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  nodemailer = require('nodemailer'),
  async = require('async'),
  cassandra = require('express-cassandra'),
  User = cassandra.instance.Users,
  authMiddleware = require(path.resolve('./modules/core/security/password-security.server')),
  crypto = require('crypto');

var smtpTransport = nodemailer.createTransport(config.mailer.options);

/**
 * Forgot for reset password (forgot POST)
 */
exports.forgot = function (req, res, next) {
  async.waterfall([
    // Generate random token 
    function (done) {
      crypto.randomBytes(20, function (err, buffer) {
        var token = buffer.toString('hex');
        done(err, token);
      });
    },
    // Lookup user by username
    function (token, done) {
      if (req.body.email) {

        var email = String(req.body.email).toLowerCase();

        User.findOne({ email: email }, { allow_filtering: true },  (err, user) => {
          if (err || !user) {
            return res.status(400).send({
              message: 'No account with that username or email has been found'
            });
          } else if (user.provider !== 'local') {
            return res.status(400).send({
              message: 'It seems like you signed up using your ' + user.provider + ' account, please sign in using that provider.'
            });
          } else {
            let query =  {
              resetPasswordToken: token,
              resetPasswordExpires: Date.now() + 3600000 // 1 hour
            };

            User.update({ id: user.id }, query, (err) => {
              done(err, token, user);
            });
          }
        });
      } else {
        return res.status(422).send({
          message: 'Username/email field must not be blank'
        });
      }
    },
    function (token, user, done) {
      var httpTransport = 'http://';
      if (config.secure && config.secure.ssl === true) {
        httpTransport = 'https://';
      }
      var baseUrl = config.domain || httpTransport + req.headers.host;
      res.render(path.resolve('modules/users/server/templates/reset-password-email'), {
        name: user.displayName,
        appName: config.app.title,
        url: baseUrl + '/api/auth/reset/' + token
      }, function (err, emailHTML) {
        done(err, emailHTML, user);
      });
    },
    // If valid email, send reset email using service
    function (emailHTML, user, done) {
      var mailOptions = {
        to: user.email,
        from: config.mailer.from,
        subject: 'Password Reset',
        html: emailHTML
      };
      smtpTransport.sendMail(mailOptions, function (err) {
        if (!err) {
          res.send({
            message: 'An email has been sent to the provided email with further instructions.'
          });
        } else {
          console.log(err);
          return res.status(400).send({
            message: 'Failure sending email'
          });
        }

        done(err);
      });
    }
  ], function (err) {
    if (err) {
      return next(err);
    }
  });
};

/**
 * Reset password GET from email token
 */
exports.validateResetToken = function (req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() }}, { allow_filtering: true },  (err, user) => {
    if (err || !user) {
      return res.redirect('/password/reset/invalid');
    }

    res.redirect('/password/reset/' + req.params.token);
  });
};

/**
 * Reset password POST from email token
 */
exports.reset = function (req, res, next) {
  // Init Variables
  let passwordDetails = req.body;
  async.waterfall([

    function (done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() }}, { allow_filtering: true },  (err, user) => {
        if (!err && user) {
          if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
            let query = {
              password: passwordDetails.hashedPassword,
              resetPasswordToken: null,
              resetPasswordExpires: null
            };
            User.update({ id: user.id }, query, (err, result) => {
              if(err) return res.status(422).send({ message: errorHandler.getErrorMessage(err) });
              else {
                req.login(user, function (err) {
                  if (err) {
                    res.status(400).send(err);
                  } else {
                    res.send({
                      message: 'Password changed successfully'
                    });
                  }
                });
              }
            });

          } else {
            return res.status(422).send({
              message: 'Passwords do not match'
            });
          }
        } else {
          return res.status(400).send({
            message: 'Password reset token is invalid or has expired.'
          });
        }
      });
    },
    function (user, done) {
      res.render('modules/users/server/templates/reset-password-confirm-email', {
        name: user.displayName,
        appName: config.app.title
      }, function (err, emailHTML) {
        done(err, emailHTML, user);
      });
    },
    // If valid email, send reset email using service
    function (emailHTML, user, done) {
      var mailOptions = {
        to: user.email,
        from: config.mailer.from,
        subject: 'Your password has been changed',
        html: emailHTML
      };

      smtpTransport.sendMail(mailOptions, function (err) {
        done(err, 'done');
      });
    }
  ], function (err) {
    if (err) {
      return next(err);
    }
  });
};

/**
 * Change Password
 */
exports.changePassword = function (req, res, next) {
  // Init Variables
  var passwordDetails = req.body;
  if (req.user) {
    if (passwordDetails.newPassword) {
      User.findOne({ id: req.user.id }, async (err, user) => {
        if(!err && user) {
          let verified = await authMiddleware.authenticate(passwordDetails.currentPassword, user.password);
          if(verified) {
            if(passwordDetails.newPassword === passwordDetails.verifyPassword) {
              console.log('saving password');
              User.update({ id: user.id }, { password: passwordDetails.hashedPassword }, (err, result) => {
                if(err) return res.status(422).send({ message: errorHandler.getErrorMessage(err) });
                else {
                  req.login(user, function (err) {
                    if (err) {
                      res.status(400).send(err);
                    } else {
                      res.send({
                        message: 'Password changed successfully'
                      });
                    }
                  });
                }
              });

            } else {
              res.status(422).send({
                message: 'Passwords do not match'
              });
            }
          } else {
            res.status(422).send({
              message: 'Current password is incorrect'
            });            
          }
        } else {
          res.status(400).send({
            message: 'User is not found'
          });         
        }
      });

    } else {
      res.status(422).send({
        message: 'Please provide a new password'
      });
    }
  } else {
    res.status(401).send({
      message: 'User is not signed in'
    });
  }
};
