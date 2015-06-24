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

  User.find(
    {verified: true},
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
          user.firstName = 'Xxxxx';
        }

        if (!visible(loggedInUser, user.privacy.lastName)) {
          user.lastName = 'Xxxxx';
        }

        if (!visible(loggedInUser, user.privacy.email)) {
          user.email = 'Xxxxx';
        }

        if (!visible(loggedInUser, user.privacy.phone)) {
          user.phone = 'Xxxxx';
        }

        if (!visible(loggedInUser, user.privacy.pronouns)) {
          user.pronouns = 'Xxxxx';
        }

        if (!visible(loggedInUser, user.privacy.orientation)) {
          user.orientation = 'Xxxxx';
        }

        if (!visible(loggedInUser, user.privacy.primaryTags)) {
          user.primaryTags = {};
        }

        if (!visible(loggedInUser, user.privacy.bio)) {
          user.bio = 'Xxxxxx';
        }

        user.privacy = {};
        user._id = null;
      });

      res.status(200).send(users);

  });

};
