'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport');

module.exports = function(app) {

  var outlist = require('../controllers/outlist.server.controller');

  app.route('/outlist').get(outlist.getOutList);

};
