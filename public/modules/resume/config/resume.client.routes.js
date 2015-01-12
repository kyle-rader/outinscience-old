'use strict';

//Setting up route
angular.module('resume').config(['$stateProvider',
	function($stateProvider) {
		// Resume state routing
		$stateProvider.
		state('calendar', {
			url: '/calendar',
			templateUrl: 'modules/resume/views/calendar.client.view.html'
		}).
		state('resume', {
			url: '/resume',
			templateUrl: 'modules/resume/views/resume.client.view.html'
		});
	}
]);