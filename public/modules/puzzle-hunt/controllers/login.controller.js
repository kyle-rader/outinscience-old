'use strict';

angular.module('puzzle-hunt').controller('PuzzleHuntLoginController', ['$scope', 'PuzzleAuth', '$http', '$location',
  function($scope, PuzzleAuth, $http, $location) {
    $scope.puzzleAuth = PuzzleAuth;

    $scope.user = PuzzleAuth.user;

    // If user is signed in then redirect back home
    if (PuzzleAuth.user && PuzzleAuth.user._id) $location.path('/puzzle-hunt/dashboard');

    $scope.signin = function() {
      $http.post('/puzzlehunt/auth/login', $scope.credentials).success(function(response) {
        // If successful we assign the response to the global user model
        $scope.puzzleAuth.user = response;

        // And redirect to the index page
        $location.path('/puzzle-hunt/dashboard');

      }).error(function(response) {
        $scope.error = response.message;
      });
    };

  }
]);
