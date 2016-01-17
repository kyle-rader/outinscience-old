'use strict';

//Setting up route
angular.module('puzzle-hunt').config(['$stateProvider',
	function($stateProvider) {
		// The out list state routing
		$stateProvider.
		state('puzzle-hunt', {
			url: '/puzzle-hunt',
			templateUrl: 'modules/puzzle-hunt/views/puzzle-hunt.client.view.html'
		})
    .state('puzzle-hunt-info', {
      url: '/puzzle-hunt/info',
      templateUrl: 'modules/puzzle-hunt/views/puzzle-hunt.info.view.html'
    })
    .state('puzzle-hunt-sign-up', {
      url: '/puzzle-hunt/sign-up',
      templateUrl: 'modules/puzzle-hunt/views/puzzle-hunt.sign-up.view.html'
    })
    .state('puzzle-hunt-puzzles', {
      url: '/puzzle-hunt/puzzles',
      templateUrl: 'modules/puzzle-hunt/views/puzzle-hunt.puzzles.view.html'
    });
	}
]);
