'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport');

module.exports = function(app) {
	// User Routes
	var puzzleHuntUsers = require('../../app/controllers/puzzleHuntUsers.js');

	app.route('/puzzlehunt/users/list').get(puzzleHuntUsers.list);
	// Setting up the users profile api
	app.route('/puzzlehunt/users/me').get(puzzleHuntUsers.me);
	app.route('/puzzlehunt/users').put(puzzleHuntUsers.update);
	app.route('/puzzlehunt/invites').get(puzzleHuntUsers.invites);
	// app.route('/puzzlehunt/users/accounts').delete(puzzleHuntUsers.removeOAuthProvider);

	// Setting up the users password api
	app.route('/puzzlehunt/users/password').post(puzzleHuntUsers.changePassword);
	app.route('/puzzlehunt/auth/forgot').post(puzzleHuntUsers.forgot);
	app.route('/puzzlehunt/auth/reset/:token').get(puzzleHuntUsers.validateResetToken);
	app.route('/puzzlehunt/auth/reset/:token').post(puzzleHuntUsers.reset);

	// Setting up the users authentication api
	app.route('/puzzlehunt/auth/signup').post(puzzleHuntUsers.signup);
	app.route('/puzzlehunt/auth/confirm-email/:token').get(puzzleHuntUsers.confirmEmail);
	app.route('/puzzlehunt/auth/login').post(puzzleHuntUsers.login);
	app.route('/puzzlehunt/auth/signout').get(puzzleHuntUsers.signout);
	app.route('/puzzlehunt/auth/revert-email-update/:token').get(puzzleHuntUsers.revertEmailUpdate);

};
