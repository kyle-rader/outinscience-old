'use strict';

//Setting up route
angular.module('puzzle-hunt').config(['$stateProvider',
	function($stateProvider) {
		// The out list state routing
		$stateProvider.
		state('puzzle-hunt', {
			url: '/puzzle-hunt',
			templateUrl: 'modules/puzzle-hunt/views/home/home.html'
		})
    .state('puzzle-hunt-info', {
      url: '/puzzle-hunt/info',
      templateUrl: 'modules/puzzle-hunt/views/home/info.html'
    })
    .state('puzzle-hunt-puzzles', {
      url: '/puzzle-hunt/puzzles',
      templateUrl: 'modules/puzzle-hunt/views/home/puzzles.html'
    })
    .state('puzzle-hunt-sign-up', {
      url: '/puzzle-hunt/sign-up',
      templateUrl: 'modules/puzzle-hunt/views/authentication/sign-up.html'
    })
    .state('puzzle-hunt-login', {
      url: '/puzzle-hunt/login',
      templateUrl: 'modules/puzzle-hunt/views/authentication/login.html'
    })
    .state('puzzle-hunt-password-forogt', {
      url: '/puzzle-hunt/password/forgot',
      templateUrl: 'modules/puzzle-hunt/views/authentication/password-forgot.html'
    })
    .state('puzzle-hunt-dashboard', {
      url: '/puzzle-hunt/dashboard',
      templateUrl: 'modules/puzzle-hunt/views/users/dashboard.html'
    });
	}
]);
