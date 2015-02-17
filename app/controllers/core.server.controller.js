'use strict';

/**
 * Module dependencies.
 */
var mailChimp = require('../../node_modules/mailchimp-api/mailchimp'),
	validator = require('../../node_modules/email-validator'),
	config = require('../../config/mc-config.json');

var mc = new mailChimp.Mailchimp(config.apikey);

exports.index = function(req, res) {
	res.render('index', {
		user: req.user || null,
		request: req
	});
};

exports.emailSubscribe = function(req, res) {
	var validEmail = validator.validate(req.params.email);

	res.send({
		'email' : validEmail ? req.params.email : null,
		'err' : !validEmail ? 'Oops! We need a valid email address :)' : ''
	});
};
