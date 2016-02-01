'use strict';

angular.module('users').controller('PuzzleHuntSettingsController', ['$scope', '$stateParams', '$http', '$location', 'PuzzleAuth', 'Authentication',
  function($scope, $stateParams, $http, $location, PuzzleAuth, Authentication) {
    $scope.puzzleAuth = PuzzleAuth;
    $scope.oisAUth = Authentication;

    //If user is signed in then redirect back home
    if ($scope.puzzleAuth.user) $location.path('/#!/puzzle-hunt/dashboard');

    // Change user password
    $scope.changeUserPassword = function() {
      $scope.success = $scope.error = null;

      $http.post('/puzzlehunt/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
        // If successful show success message and clear form
        $scope.passwordDetails = null;

        // Attach user profile
        PuzzleAuth.user = response;
        Authentication.user = null;

        // And redirect to the index page
        $location.path('/puzzle-hunt/dashboard');
      }).error(function(response) {
        $scope.error = response.message;
      });
    };
  }
]);
