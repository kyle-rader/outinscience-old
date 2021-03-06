'use strict';
var fbConfig = require('../fb-config.json'),
		mailConfig = require('../mail-config.json');

module.exports = {
	db: 'mongodb://localhost/outinscience-dev',
	port: 3010,
	app: {
		title: 'Out in Science (Dev)'
	},
	facebook: {
		clientID: process.env.FACEBOOK_ID || fbConfig.app_id,
		clientSecret: process.env.FACEBOOK_SECRET || fbConfig.app_secret,
		callbackURL: '/auth/facebook/callback'
	},
	twitter: {
		clientID: process.env.TWITTER_KEY || 'CONSUMER_KEY',
		clientSecret: process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
		callbackURL: '/auth/twitter/callback'
	},
	google: {
		clientID: process.env.GOOGLE_ID || 'APP_ID',
		clientSecret: process.env.GOOGLE_SECRET || 'APP_SECRET',
		callbackURL: '/auth/google/callback'
	},
	linkedin: {
		clientID: process.env.LINKEDIN_ID || 'APP_ID',
		clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
		callbackURL: '/auth/linkedin/callback'
	},
	github: {
		clientID: process.env.GITHUB_ID || 'APP_ID',
		clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
		callbackURL: '/auth/github/callback'
	},
	mailer: {
		from: process.env.MAILER_FROM || mailConfig.from,
		api_key: mailConfig.api_key,
		domain: mailConfig.domain,
		reply_to: mailConfig.reply_to
	}
};
