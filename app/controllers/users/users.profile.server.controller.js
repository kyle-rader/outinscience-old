'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors.server.controller.js'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User'),
	async = require('async'),
	crypto = require('crypto'),
	config = require('../../../config/config'),
	nodemailer = require('nodemailer'),
	mg = require('nodemailer-mailgun-transport');
var auth = {
  auth: {
    api_key: config.mailer.api_key,
    domain: config.mailer.domain
  }
};
var nodemailerMailgun = nodemailer.createTransport(mg(auth));
/**
 * Update user details
 */
exports.update = function(req, res) {
	// Init Variables
	var user = req.user;
	var message = null;
	var newEmail = false;
	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	if (user) {
		// Check for email change - must re-verify if changing email addresses.
		if (req.body.email && req.body.email !== user.email) {
			newEmail = true;
			crypto.randomBytes(20, function(err, buffer) {
				var token = buffer.toString('hex');
				user.confirmEmailToken = token;
				user.confirmEmailExpires = Date.now() + 86400000; // 24 hours
				user.verified = false;
			});
		}

		// Merge existing user
		var originalEmail = user.email;
		user = _.extend(user, req.body);
		user.updated = Date.now();
		user.displayName = user.firstName + ' ' + user.lastName;

		user.save(function(err) {
			if (err && err.message !== 'email-in-use') {
				return res.status(400).send({
					message: err.message || errorHandler.getErrorMessage(err)
				});
			} else if (err && err.message === 'email-in-use') {
				user.email = originalEmail;
				user.save();
				User.findOne({
					email: user.email
				}, function(err, existingUser) {
					if (!err && existingUser) {
						res.render('templates/email-in-use-warning-email', {
							name: existingUser.displayName,
							appName: config.app.title,
							imposter: user.displayName
						}, function(err, emailHTML) {
							nodemailerMailgun.sendMail({
								from: config.mailer.from,
								to: user.email,
								subject: 'Out In Science: Account Email Update Attempted',
								'h:Reply-To': config.mailer.reply_to,
								html: emailHTML,
								text: emailHTML
							});
						});
					}
				});
			} else if(newEmail) {
				res.render('templates/email-confirmation-email', {
					name: user.displayName,
					appName: config.app.title,
					url: req.protocol + '://' + req.headers.host + '/auth/confirm-email/' + user.confirmEmailToken
				}, function(err, emailHTML) {
					nodemailerMailgun.sendMail({
						from: config.mailer.from,
						to: user.email,
						subject: 'Out In Science: Confirm Email',
						'h:Reply-To': config.mailer.reply_to,
						html: emailHTML,
						text: emailHTML
					});
				});

			} else {
				req.login(user, function(err) {
					if (err) {
						res.status(400).send(err);
					} else {
						res.json(user);
					}
				});
			}
			if (newEmail) {
				req.logout();
				return res.status(200).send({message: 'logout'});
			}
		});
	} else {
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};

/**
 * Send User
 */
exports.me = function(req, res) {
	res.json(req.user || null);
};
