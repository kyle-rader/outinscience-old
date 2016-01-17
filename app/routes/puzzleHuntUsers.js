'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport');

module.exports = function(app) {
	// User Routes
	var puzzleHuntUsers = require('../../app/controllers/puzzleHuntUsers.js');

	// Setting up the users profile api
	app.route('/puzzlehunt/users/me').get(puzzleHuntUsers.me);
	app.route('/puzzlehunt/users').put(puzzleHuntUsers.update);
	app.route('/puzzlehunt/users/accounts').delete(puzzleHuntUsers.removeOAuthProvider);

	// Setting up the users password api
	app.route('/users/password').post(puzzleHuntUsers.changePassword);
	app.route('/auth/forgot').post(puzzleHuntUsers.forgot);
	app.route('/auth/reset/:token').get(puzzleHuntUsers.validateResetToken);
	app.route('/auth/reset/:token').post(puzzleHuntUsers.reset);

	// Setting up the users authentication api
	app.route('/auth/signup').post(puzzleHuntUsers.signup);
	app.route('/auth/confirm-email/:token').get(puzzleHuntUsers.confirmEmail);
	app.route('/auth/signin').post(puzzleHuntUsers.signin);
	app.route('/auth/signout').get(puzzleHuntUsers.signout);
	app.route('/auth/revert-email-update/:token').get(puzzleHuntUsers.revertEmailUpdate);

	// Finish by binding the user middleware
	app.param('userId', puzzleHuntUsers.userByID);
};
