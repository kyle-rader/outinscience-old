'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash');

/**
 * Extend user's controller
 */
module.exports = _.extend(
	require('./puzzleHuntUsers/authentication'),
	require('./puzzleHuntUsers/authorization'),
	require('./puzzleHuntUsers/password'),
	require('./puzzleHuntUsers/profile')
);
