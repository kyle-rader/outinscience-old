'use strict';

//Setting up route
angular.module('puzzle-hunt').config(['$stateProvider',
	function($stateProvider) {
		// The out list state routing
		$stateProvider.
		state('puzzle-hunt', {
			url: '/puzzle-hunt',
			templateUrl: 'modules/puzzle-hunt/views/home.html'
		})
    .state('puzzle-hunt-info', {
      url: '/puzzle-hunt/info',
      templateUrl: 'modules/puzzle-hunt/views/info.html'
    })
    .state('puzzle-hunt-sign-up', {
      url: '/puzzle-hunt/sign-up',
      templateUrl: 'modules/puzzle-hunt/views/sign-up.html'
    })
    .state('puzzle-hunt-sign-in', {
      url: '/puzzle-hunt/sign-in',
      templateUrl: 'modules/puzzle-hunt/views/sign-in.html'
    })
    .state('puzzle-hunt-puzzles', {
      url: '/puzzle-hunt/puzzles',
      templateUrl: 'modules/puzzle-hunt/views/puzzles.html'
    });
	}
]);
