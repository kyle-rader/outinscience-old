'use strict';

module.exports = function(app) {
	var terms = require('../controllers/resources.server.controller.js');

	app.route('/terms/getTerms').post(terms.getTerms);

};
