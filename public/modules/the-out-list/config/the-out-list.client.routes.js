'use strict';

//Setting up route
angular.module('the-out-list').config(['$stateProvider',
  function($stateProvider) {
    // The out list state routing
    $stateProvider.
    state('the-out-list', {
      url: '/the-out-list',
      templateUrl: 'modules/the-out-list/views/the-out-list.client.view.html'
    });
  }
]);
