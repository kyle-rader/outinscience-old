'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('./errors.server.controller.js'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User'),
	async = require('async'),
	crypto = require('crypto'),
	config = require('../../config/config');

var visible = function(user, privacy) {
  return privacy === 'public' || (privacy === 'internal' && user && user._id);
};

exports.getOutList = function(req, res) {
  // Init Variables
	var loggedInUser = req.user;
  var outlist = [];
	var query = {verified: true};
	if (loggedInUser && loggedInUser._id) {
		query._id = { '$ne' : loggedInUser._id };
	}

  User.find(
		query,
    {firstName: 1, lastName: 1, email: 1, phone: 1, pronouns: 1, orientation: 1, primaryTags: 1, bio: 1, privacy: 1},
    function(err, users) {
      if (err && !users) {
        return res.status(400).send({
          message: err.message || errorHandler.getErrorMessage(err)
        });
      }
      console.log(loggedInUser ? 'Logged in' : 'Public viewer');

      // Make private fields anonymous
      users.forEach(function(user) {
        if (!visible(loggedInUser, user.privacy.firstName)) {
          user.firstName = 'Anonymous';
        }

        if (!visible(loggedInUser, user.privacy.lastName)) {
          user.lastName = 'Fox';
        }

        if (!visible(loggedInUser, user.privacy.email)) {
          user.email = '';
        }

        if (!visible(loggedInUser, user.privacy.phone)) {
          user.phone = '';
        }

        if (!visible(loggedInUser, user.privacy.pronouns)) {
          user.pronouns = '';
        }

        if (!visible(loggedInUser, user.privacy.orientation)) {
          user.orientation = '';
        }

        if (!visible(loggedInUser, user.privacy.primaryTags)) {
          user.primaryTags = {};
        }

        if (!visible(loggedInUser, user.privacy.bio)) {
          user.bio = '';
        }

        user.privacy = {};
        user._id = null;
      });
			res.status(200).send(users);
  });


};
