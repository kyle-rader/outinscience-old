'use strict';

angular.module('puzzle-hunt').controller('PuzzleHuntDashboardController', ['$scope', 'PuzzleAuth', '$http', '$location',
  function($scope, PuzzleAuth, $http, $location) {
    $scope.user = PuzzleAuth.user;

    // If user is signed in then redirect back home
    if (!PuzzleAuth.user || !PuzzleAuth.user._id) $location.path('/puzzle-hunt/login');

  }
]);
