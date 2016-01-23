'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash');

/**
 * Extend user's controller
 */
module.exports = _.extend(
	require('./puzzleHuntTeams/authentication'),
	//require('./puzzleHuntUsers/authorization'),
	//require('./puzzleHuntUsers/password'),
	require('./puzzleHuntTeams/profile')
);
