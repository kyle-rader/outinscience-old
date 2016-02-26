'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  errorHandler = require('../errors.server.controller'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  User = mongoose.model('PuzzleHuntUser'),
  config = require('../../../config/config'),
  nodemailer = require('nodemailer'),
  mg = require('nodemailer-mailgun-transport'),
  async = require('async'),
  crypto = require('crypto');
var auth = {
  auth: {
    api_key: config.mailer.api_key,
    domain: config.mailer.domain
  }
};
var nodemailerMailgun = nodemailer.createTransport(mg(auth));

/**
 * Forgot for reset password (forgot POST)
 */
exports.forgot = function(req, res, next) {
  async.waterfall([
    // Generate random token
    function(done) {
      crypto.randomBytes(20, function(err, buffer) {
        var token = buffer.toString('hex');
        done(err, token);
      });
    },
    // Lookup user by email
    function(token, done) {
      if (req.body.email) {
          req.body.email = req.body.email.trim().toLowerCase().concat('@students.wwu.edu');
        User.findOne({
          email: req.body.email,
          verified: true
        }, '-salt -password', function(err, user) {
          if (!user) {
            res.send({
              message: 'If we find an account with that email we will send further instructions.'
            });
          } else {
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

            user.save(function(err) {
              done(err, token, user);
            });
          }
        });
      } else {
        return res.status(400).send({
          message: 'Email field must not be blank'
        });
      }
    },
    function(token, user, done) {
      res.render('templates/puzzle-hunt-reset-password-email', {
        name: user.firtsName,
        appName: config.app.title,
        url: req.protocol + '://' + req.headers.host + '/puzzlehunt/auth/reset/' + token
      }, function(err, emailHTML) {
        done(err, emailHTML, user);
      });
    },
    // If valid email, send reset email using service
    function(emailHTML, user, done) {
      nodemailerMailgun.sendMail({
        from: config.mailer.from,
        to: user.email, // An array if you have multiple recipients.
        subject: 'WWU Puzzle Hunt: Password Reset',
        'h:Reply-To': config.mailer.reply_to,
        //You can use "html:" to send HTML email content. It's magic!
        html: emailHTML,
        //You can use "text:" to send plain-text content. It's oldschool!
        text: emailHTML
      }, function(err) {
        if (!err) {
          res.send({
            message: 'If we find an account with that email we will send further instructions.'
          });
        }
        done(err);
      });
    }
  ], function(err) {
    if (err) return next(err);
  });
};

/**
 * Reset password GET from email token
 */
exports.validateResetToken = function(req, res) {
  User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: {
      $gt: Date.now()
    }
  }, function(err, user) {
    if (!user) {
      return res.redirect('/#!/puzzle-hunt/password/reset-invalid');
    }

    res.redirect('/#!/puzzle-hunt/password/reset/' + req.params.token);
  });
};

/**
 * Reset password POST from email token
 */
exports.reset = function(req, res, next) {
  // Init Variables
  var passwordDetails = req.body;

  async.waterfall([
    function(done) {
      User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {
          $gt: Date.now()
        }
      }, function(err, user) {
        if (!err && user) {
          if (!passwordDetails.newPassword || !passwordDetails.verifyPassword) {
            return res.status(400).send({
              message: 'Password fields must not be empty'
            });
          }
          else if (passwordDetails.newPassword.length < 8) {
            return res.status(400).send({
              message: 'Password must be at least 8 characters'
            });
          }
          if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
            user.password = passwordDetails.newPassword;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.skipHash = false;
            // Not assigning skipHash
            // so this password will be hashed on save.
            user.save(function(err) {
              if (err) {
                return res.status(400).send({
                  message: errorHandler.getErrorMessage(err)
                });
              } else {
                req.login(user, function(err) {
                  if (err) {
                    return res.status(400).send(err);
                  } else {
                    // Continue with logged in udpdated user
                    res.json(user);
                    done(err, user);
                  }
                });
              }
            });
          } else {
            return res.status(400).send({
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
    function(user, done) {
      res.render('templates/puzzle-hunt-reset-password-confirm-email', {
        name: user.displayName,
        appName: config.app.title
      }, function(err, emailHTML) {
        done(err, emailHTML, user);
      });
    },
    // If valid email, send reset email success message
    function(emailHTML, user, done) {
      nodemailerMailgun.sendMail({
        from: config.mailer.from,
        to: user.email, // An array if you have multiple recipients.
        subject: 'WWU Puzzle Hunt: Password Change Successful',
        'h:Reply-To': config.mailer.reply_to,
        //You can use "html:" to send HTML email content. It's magic!
        html: emailHTML,
        //You can use "text:" to send plain-text content. It's oldschool!
        text: emailHTML
      }, function(err) {
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
  });
};

/**
 * Change Password
 */
exports.changePassword = function(req, res) {
  // Init Variables
  var passwordDetails = req.body;

  if (req.user && req.user.userType === 'puzzleHuntUser') {
    if (passwordDetails.newPassword) {
      User.findById(req.user.id, function(err, user) {
        if (!err && user) {
          if (user.authenticate(passwordDetails.currentPassword)) {
            if (!passwordDetails.newPassword || !passwordDetails.verifyPassword) {
              return res.status(400).send({
                message: 'Password fields must not be empty'
              });
            }
            else if (passwordDetails.newPassword.length < 8) {
              return res.status(400).send({
                message: 'Password must be at least 8 characters'
              });
            }
            if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
              user.password = passwordDetails.newPassword;

              user.save(function(err) {
                if (err) {
                  return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                  });
                } else {
                  req.login(user, function(err) {
                    if (err) {
                      res.status(400).send(err);
                    } else {
                      res.status(200).send({
                        message: 'Password changed successfully'
                      });
                    }
                  });
                }
              });
            } else {
              res.status(400).send({
                message: 'Passwords do not match'
              });
            }
          } else {
            res.status(400).send({
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
      res.status(400).send({
        message: 'Please provide a new password'
      });
    }
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};
