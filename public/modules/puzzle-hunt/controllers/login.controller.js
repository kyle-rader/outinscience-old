'use strict';

angular.module('puzzle-hunt').controller('PuzzleHuntLoginController', ['$scope', 'PuzzleAuth', 'Authentication', '$http', '$location',
  function($scope, PuzzleAuth, Authentication, $http, $location) {
    $scope.puzzleAuth = PuzzleAuth;
    $scope.oisAuth = Authentication;
    $scope.user = PuzzleAuth.user;

    // If user is signed in then redirect back home
    if (PuzzleAuth.user && PuzzleAuth.user._id) $location.path('/puzzle-hunt/' + (PuzzleAuth.user.teamId === null ? 'no-team' : 'team'));

    $scope.signin = function() {
      $http.post('/puzzlehunt/auth/login', $scope.credentials).success(function(response) {
        // If successful we assign the response to the global user model
        $scope.puzzleAuth.user = response;
        // Remove Out in Science user.
        $scope.oisAuth.user = null;
        // And redirect to the index page
        if ($scope.puzzleAuth.user.teamId !== null) {
          $location.path('/puzzle-hunt/dashboard');
        }
        else {
          $location.path('/puzzle-hunt/no-team');
        }

      }).error(function(response) {
        $scope.error = response.message;
      });
    };

  }
]);
