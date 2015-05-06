'use strict';

//Setting up route
angular.module('events').config(['$stateProvider',
	function($stateProvider) {
		// Events state routing
		$stateProvider.
		state('events', {
			url: '/events',
			templateUrl: 'modules/events/views/events.client.view.html'
		});
	}
]);