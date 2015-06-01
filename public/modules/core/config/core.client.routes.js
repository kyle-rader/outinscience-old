'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('user-agreement-terms-of-service', {
			url: '/user-agreement-terms-of-service',
			templateUrl: 'modules/core/views/user-agreement-terms-of-service.client.view.html'
		}).
		state('team', {
			url: '/team',
			templateUrl: 'modules/core/views/team.client.view.html'
		}).
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);
