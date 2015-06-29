'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * User Schema
 */
var TermsSchema = new Schema({
	term: {
		type: String
	},
	def: {
		type: String
	}
});

mongoose.model('Term', TermsSchema);
