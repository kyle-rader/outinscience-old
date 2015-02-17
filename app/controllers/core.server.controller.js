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

	if (process.env.NODE_ENV == 'production' && validEmail) {
		mc.lists.subscribe({id: req.params.listId, email:{email:req.params.email}},
		function(data) {
			res.send({email: req.params.eamil});
		},
		function(error) {
			res.send({email: null, error: 'There was an error subscribing that email.\n' + error.error});
		});
	} else if (process.env.NODE_ENV == 'development') {
		res.send({email: null, error: 'This email "' + req.params.email + '" would have been subscribe - but you are hitting a dev server.'});
	} else {
		res.send({email: req.params.email + ' - Running on dev - no email sent.', error: 'Invalid email address format'});
	}
};
