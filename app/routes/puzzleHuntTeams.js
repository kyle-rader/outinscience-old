'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport');

module.exports = function(app) {
    // User Routes
    var puzzleHuntTeams = require('../../app/controllers/puzzleHuntTeams.js');

    app.route('/puzzlehunt/teams').get(puzzleHuntTeams.list);
    app.route('/puzzlehunt/team/:teamId').get(puzzleHuntTeams.getTeam);
    app.route('/puzzlehunt/auth/createTeam').post(puzzleHuntTeams.createNew);
    app.route('/puzzlehunt/team/:teamId/password-join').post(puzzleHuntTeams.joinTeamByPassword);

    // Setting up the team profile api
    /*
    app.route('/puzzlehunt/teams/us').get(puzzleHuntTeams.us);
    app.route('/puzzlehunt/users').put(puzzleHuntUsers.update);
    app.route('/puzzlehunt/users/accounts').delete(puzzleHuntUsers.removeOAuthProvider);

    // Setting up the users password api
    app.route('/puzzlehunt/users/password').post(puzzleHuntUsers.changePassword);
    app.route('/puzzlehunt/auth/forgot').post(puzzleHuntUsers.forgot);
    app.route('/puzzlehunt/auth/reset/:token').get(puzzleHuntUsers.validateResetToken);
    app.route('/puzzlehunt/auth/reset/:token').post(puzzleHuntUsers.reset);

    // Setting up the users authentication api
    app.route('/puzzlehunt/auth/confirm-email/:token').get(puzzleHuntUsers.confirmEmail);
    app.route('/puzzlehunt/auth/signin').post(puzzleHuntUsers.signin);
    app.route('/puzzlehunt/auth/signout').get(puzzleHuntUsers.signout);
    app.route('/puzzlehunt/auth/revert-email-update/:token').get(puzzleHuntUsers.revertEmailUpdate);

    // Finish by binding the user middleware
    app.param('userId', puzzleHuntUsers.userByID);
    */
};
