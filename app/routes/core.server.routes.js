'use strict';

module.exports = function(app) {
	// Root routing
	var core = require('../../app/controllers/core.server.controller');

	app.route('/mail/subscribe/:email').post(core.emailSubscribe);

	app.route('/').get(core.index);

};