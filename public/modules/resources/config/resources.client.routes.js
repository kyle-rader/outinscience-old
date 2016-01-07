'use strict';

//Setting up route
angular.module('resources').config(['$stateProvider',
	function($stateProvider) {
		// Resources state routing
		$stateProvider.
		state('terms', {
			url: '/resources/terms',
			templateUrl: 'modules/resources/views/terms.client.view.html'
		});
	}
]);
