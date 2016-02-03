'use strict';

//Setting up route
angular.module('puzzle-hunt').config(['$stateProvider',
  function($stateProvider) {

    $stateProvider.
    // Public Info Pages
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
      templateUrl: 'modules/puzzle-hunt/views/password/forgot.html'
    })
    .state('puzzle-hunt-password-reset', {
      url: '/puzzle-hunt/password/reset/:token',
      templateUrl: 'modules/puzzle-hunt/views/password/reset.html'
    })
    .state('puzzle-hunt-password-reset-invalid', {
      url: '/puzzle-hunt/password/reset-invalid',
      templateUrl: 'modules/puzzle-hunt/views/password/reset-invalid.html'
    })
    .state('puzzle-hunt-password-reset-success', {
      url: '/puzzle-hunt/password/reset-success',
      templateUrl: 'modules/puzzle-hunt/views/password/reset-success.html'
    })
    // Internal WWU Puzzle Hunt Pages
    .state('puzzle-hunt-dashboard', {
      url: '/puzzle-hunt/dashboard',
      templateUrl: 'modules/puzzle-hunt/views/users/dashboard.html'
    })
    .state('puzzle-hunt-team', {
      url: '/puzzle-hunt/no-team',
      templateUrl: 'modules/puzzle-hunt/views/users/no-team.html'
    });
  }
]);
