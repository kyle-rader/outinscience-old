'use strict';

//Setting up route
angular.module('cool-things').config(['$stateProvider',
	function($stateProvider) {
		// Cool things state routing
		$stateProvider.
		state('cool-things', {
			url: '/cool-things',
			templateUrl: 'modules/cool-things/views/cool-things.client.view.html'
		});
	}
]);