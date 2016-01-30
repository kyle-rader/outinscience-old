'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
  mongoose = require('mongoose'),
  path = require('path'),
  config = require('./config');

var OutInScienceUser = mongoose.model('User'),
PuzzleHuntUser = mongoose.model('PuzzleHuntUser');

/**
 * Module init function.
 */
module.exports = function() {
  // Serialize sessions
  passport.serializeUser(function(user, done) {
    var key = {
      id: user.id,
      type: user.userType
    };

    done(null, key);
  });

  // Deserialize sessions
  passport.deserializeUser(function(key, done) {
    var User = key.type === 'outInScienceUser' ? OutInScienceUser : PuzzleHuntUser;

    User.findOne({
      _id: key.id
    }, '-salt -password', function(err, user) {
      done(err, user);
    });
  });

  // Initialize strategies
  config.getGlobbedFiles('./config/strategies/**/*.js').forEach(function(strategy) {
    require(path.resolve(strategy))();
  });
};
