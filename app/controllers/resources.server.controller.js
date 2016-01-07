'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Terms = mongoose.model('Term'),
  errorHandler = require('./errors.server.controller'),
  _ = require('lodash'),
  config = require('../../config/config');

/**
 * Get Terms
 */
exports.getTerms = function(req, res) {
  Terms.find({}, {term: 1, def: 1}, function(err, terms) {
   if (err) {
     res.status(400).send(err);
   } else {
     res.status(200).send(terms);
   }
  });
};
