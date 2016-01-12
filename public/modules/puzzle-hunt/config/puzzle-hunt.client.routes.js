'use strict';

//Setting up route
angular.module('puzzle-hunt').config(['$stateProvider',
	function($stateProvider) {
		// The out list state routing
		$stateProvider.
		state('puzzle-hunt', {
			url: '/puzzle-hunt',
			templateUrl: 'modules/puzzle-hunt/views/puzzle-hunt.client.view.html'
		});
	}
]);
