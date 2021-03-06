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
  crypto = require('crypto'),
  Validator = require('is-my-json-valid'),
  JSONSchema = require('../../models/puzzleHuntUsersRequired.json');

var auth = {
  auth: {
    api_key: config.mailer.api_key,
    domain: config.mailer.domain
  }
};

var nodemailerMailgun = nodemailer.createTransport(mg(auth));

var signupValidate = new Validator({
  type: 'object',
  properties: JSONSchema.properties,
  required: JSONSchema.required
}, {greedy: true});


var EMAIL_DOMAIN = '@students.wwu.edu';

/**
 * /puzzlehunt/users/signup POST
 */
var makeErrMessage = function() {
  return {
    message: 'One or more invalid fields',
    errors: {}
  };
};

exports.signup = function(req, res) {
  // For security measurement we remove the roles from the req.body object
  delete req.body.roles;

  async.waterfall([
    // Make sure the new User object conforms (in part) to our schema
    // And the fields have valid values
    function(done) {
      var errMessage = null;

      // Check for valid json structure and required fields.
      if (!signupValidate(req.body)) {
        errMessage = makeErrMessage();

        var errors = signupValidate.errors;
        for (var i = 0; i < errors.length; i++) {
          var fieldName = errors[i].field.substr(5);
          errMessage.errors[fieldName] = fieldName + ' ' + errors[i].message;
        }
      }

      // Enforce WWU Student Email Address
      if (req.body.email.match(/(@.*|\.)/g)) {
        if (!errMessage)
          errMessage = makeErrMessage();
        errMessage.errors.email = 'You must use a valid WWU username. (Not a full email address)';
      }
      else {
          req.body.email = req.body.email.trim().toLowerCase() + EMAIL_DOMAIN;
      }
      

      // Enforce phone number to be at 10 or 11 digits
      req.body.phone = req.body.phone ? req.body.phone.trim() : '';
      req.body.phone = req.body.phone.replace(/[\D]*/g, '');
      if (req.body.phone.length < 10 || req.body.phone.length > 11) {
        if (!errMessage)
          errMessage = makeErrMessage();
        errMessage.errors.phone = 'Phone number must be 10 or 11 digits long.';
      }

      // Enforce password length of at least 8 characters
      if (req.body.password && req.body.password.length < 8) {
        if (!errMessage)
          errMessage = makeErrMessage();
        errMessage.errors.password = 'Password must be at least 8 characters long!';
      }
      done(errMessage);
    },
    // Generate random token
    function(done) {
      crypto.randomBytes(20, function(err, buffer) {
        var token = buffer.toString('hex');
        done(err, token); // err not passed to next function
      });
    },
    // Create new user object
    function(token, done) {
      // "done" argument is appended automatically
      var newUser = new User(req.body);
      var err = newUser ? null : {message: 'Failed to create user!'};

      done(err, token, newUser);
    },
    // Attempt to save user with verify token
    function(token, newUser, done) {

      // Init Variables
      var message = null;

      // Add missing user fields
      newUser.provider = 'puzzleHuntUser';
      newUser.displayName = newUser.firstName + ' ' + newUser.lastName;

      newUser.confirmEmailToken = token;
      newUser.confirmEmailExpires = Date.now() + 86400000; // 24 hours

      newUser.verified = false;
      
      // Set userType for sessions serialization differentiation.
      newUser.userType = 'puzzleHuntUser';

      // Then save the user
      newUser.save(function(err) {
        if (err && err.message !== 'email-in-use') {
          console.log(err);
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          done(null, token, newUser, (err && err.message === 'email-in-use'));
        }
      });
    },
    // Render Response Email (Verification or Warning)
    function(token, user, emailInUse, done) {
      if (!emailInUse) {
        // Send the normal confirm email
        res.render('templates/puzzle-hunt-email-confirmation-email', {
          name: user.firstName,
          appName: config.app.title,
          url: req.protocol + '://' + req.headers.host + '/puzzlehunt/auth/confirm-email/' + token
        }, function(err, emailHTML) {
          done(err, emailHTML, user, 'WWU Great Puzzle Hunt: Confirm Email');
        });
      } else {
        // Send a warning email to the existing user about this potential attempt
        // of breach in security.
        User.findOne({
          email: user.email
        }, function(err, existingUser) {
          if (!err && existingUser) {
            res.render('templates/puzzle-hunt-email-in-use-warning-email', {
              name: existingUser.displayName,
              appName: config.app.title,
              imposter: user.displayName
            }, function(err, emailHTML) {
              done(err, emailHTML, user, 'WWU Great Puzzle Hunt: Attempted Account Creation');
            });
          } else {
            done({message: 'Account creation failed.  For support, email support@outinscience.com'});
          }
        });
      }
    },
    // Send Rendered email
    function(emailHTML, user, subject, done) {
      nodemailerMailgun.sendMail({
        from: config.mailer.from,
        to: user.email,
        subject: subject,
        'h:Reply-To': config.mailer.reply_to,
        html: emailHTML,
        text: emailHTML
      }, function(err) {
        if (err) done(err);
        else res.send({message: 'A confirmation email has been sent to '+ user.email + '.'});
      });
    }
  ],
  function(err) {
    if (err) res.status(400).send(err);
  });
};

/**
 * Confirm email after account creation
 */
exports.confirmEmail = function(req, res) {
  User.findOne({
    confirmEmailToken: req.params.token
  }, function(err, user) {
    if (!user) {
      return res.redirect('/#!/auth/confirm-email-invalid');
    }
    else if (parseInt(user.confirmEmailExpires) < parseInt(Date.now())) {
      return res.redirect('/#!/auth/confirm-email-invalid');
    }
    else {
      user.verified = true;
      user.confirmEmailExpires = 0;
      user.updated = Date.now();
      user.skipHash = true;

      user.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: err.message || errorHandler.getErrorMessage(err)
        });
      } else {
        req.login(user, function(err) {
          if (err) {
            res.status(400).send(err);
          } else {
            res.redirect('/#!/puzzle-hunt/no-team');
          }
        });
      }
      });
    }
  });
};

/**
 * Revert Email Update
 */
exports.revertEmailUpdate = function(req, res) {
  User.findOne({
    revertEmailToken: req.params.token,
    verified: false
  }, function(err, user) {
    if (!user) {
      return res.redirect('/#!/auth/confirm-email-invalid');
    } else {
      user.verified = true;
      user.email = user.oldEmail;
      user.updated = Date.now();
      user.skipHash = true;
      user.revertEmailToken = null;

      user.save(function(err) {
        if (err) {
          return res.status(400).send({
            message: err.message || errorHandler.getErrorMessage(err)
          });
        } else {
          req.login(user, function(err) {
            if (err) {
              res.status(400).send(err);
            } else {
              res.redirect('/#!/puzzle-hunt/dashboard');
            }
          });
        }
      });
    }
  });
};

/**
 * Signin after passport authentication
 */
exports.login = function(req, res, next) {
  // Use full WWU email
  req.body.email = req.body.email ? req.body.email.trim() + EMAIL_DOMAIN : '';

  passport.authenticate('puzzleHuntUser', function(err, user, info) {
    if (err || !user) {
      res.status(400).send(info);
    } else {
      // Remove sensitive data before login
      user.password = undefined;
      user.salt = undefined;

      req.login(user, function(err) {
        if (err) {
          res.status(400).send(err);
        } else if (!user.verified) {
            req.logout();
            res.status(400).send({message: 'No account with that email exists or that email is not yet verified.'});
        } else {
          res.json(user);
        }
      });
    }
  })(req, res, next);
};

/**
 * Signout
 */
exports.signout = function(req, res) {
  req.logout();
  res.redirect('/#!/puzzle-hunt');
};

/**
* List Users
*/
exports.list = function(req, res){
  User.find({}, function(err, users){
    if(err){
      res.status(400).send(err);
    } else {
      res.json(users);
    }
  });
};

/**
 * OAuth callback
 */
// exports.oauthCallback = function(strategy) {
//   return function(req, res, next) {
//     passport.authenticate(strategy, function(err, user, redirectURL) {
//       if (err || !user) {
//         return res.redirect('/#!/signin');
//       }
//       req.login(user, function(err) {
//         if (err) {
//           return res.redirect('/#!/signin');
//         }
//
//         return res.redirect(redirectURL || '/');
//       });
//     })(req, res, next);
//   };
// };

/**
 * Helper function to save or update a OAuth user profile
 */
// exports.saveOAuthUserProfile = function(req, providerUserProfile, done) {
//   if (!req.user) {
//     // Define a search query fields
//     var searchMainProviderIdentifierField = 'providerData.' + providerUserProfile.providerIdentifierField;
//     var searchAdditionalProviderIdentifierField = 'additionalProvidersData.' + providerUserProfile.provider + '.' + providerUserProfile.providerIdentifierField;
//
//     // Define main provider search query
//     var mainProviderSearchQuery = {};
//     mainProviderSearchQuery.provider = providerUserProfile.provider;
//     mainProviderSearchQuery[searchMainProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];
//
//     // Define additional provider search query
//     var additionalProviderSearchQuery = {};
//     additionalProviderSearchQuery[searchAdditionalProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];
//
//     // Define a search query to find existing user with current provider profile
//     var searchQuery = {
//       $or: [mainProviderSearchQuery, additionalProviderSearchQuery]
//     };
//
//     User.findOne(searchQuery, function(err, user) {
//       if (err) {
//         return done(err);
//       } else {
//         if (!user) {
//           var possibleUsername = providerUserProfile.username || ((providerUserProfile.email) ? providerUserProfile.email.split('@')[0] : '');
//
//           User.findUniqueUsername(possibleUsername, null, function(availableUsername) {
//             user = new User({
//               firstName: providerUserProfile.firstName,
//               lastName: providerUserProfile.lastName,
//               username: availableUsername,
//               displayName: providerUserProfile.displayName,
//               email: providerUserProfile.email,
//               provider: providerUserProfile.provider,
//               providerData: providerUserProfile.providerData
//             });
//
//             // And save the user
//             user.save(function(err) {
//               return done(err, user);
//             });
//           });
//         } else {
//           return done(err, user);
//         }
//       }
//     });
//   } else {
//     // User is already logged in, join the provider data to the existing user
//     var user = req.user;
//
//     // Check if user exists, is not signed in using this provider, and doesn't have that provider data already configured
//     if (user.provider !== providerUserProfile.provider && (!user.additionalProvidersData || !user.additionalProvidersData[providerUserProfile.provider])) {
//       // Add the provider data to the additional provider data field
//       if (!user.additionalProvidersData) user.additionalProvidersData = {};
//       user.additionalProvidersData[providerUserProfile.provider] = providerUserProfile.providerData;
//
//       // Then tell mongoose that we've updated the additionalProvidersData field
//       user.markModified('additionalProvidersData');
//
//       // And save the user
//       user.save(function(err) {
//         return done(err, user, '/#!/settings/accounts');
//       });
//     } else {
//       return done(new Error('User is already connected using this provider'), user);
//     }
//   }
// };

/**
 * Remove OAuth provider
 */
// exports.removeOAuthProvider = function(req, res, next) {
//   var user = req.user;
//   var provider = req.param('provider');
//
//   if (user && provider) {
//     // Delete the additional provider
//     if (user.additionalProvidersData[provider]) {
//       delete user.additionalProvidersData[provider];
//
//       // Then tell mongoose that we've updated the additionalProvidersData field
//       user.markModified('additionalProvidersData');
//     }
//
//     user.save(function(err) {
//       if (err) {
//         return res.status(400).send({
//           message: errorHandler.getErrorMessage(err)
//         });
//       } else {
//         req.login(user, function(err) {
//           if (err) {
//             res.status(400).send(err);
//           } else {
//             res.json(user);
//           }
//         });
//       }
//     });
//   }
// };
