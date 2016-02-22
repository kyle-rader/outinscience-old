'use strict';

angular.module('users').controller('PuzzleHuntPasswordController', ['$scope', '$stateParams', '$http', '$location', 'PuzzleAuth', 'Authentication',
  function($scope, $stateParams, $http, $location, PuzzleAuth, Authentication) {
    $scope.puzzleAuth = PuzzleAuth;

    //If user is signed in then redirect back home
    if ($scope.puzzleAuth.user) $location.path('/#!/puzzle-hunt');

    // Submit forgotten password account id
    $scope.askForPasswordReset = function() {
      $scope.success = $scope.error = null;

      $http.post('/puzzlehunt/auth/forgot', $scope.credentials).success(function(response) {
        // Show user success message and clear form
        $scope.credentials = null;
        $scope.success = response.message;

      }).error(function(response) {
        // Show user error message and clear form
        $scope.credentials = null;
        $scope.error = response.message;
      });
    };

    // Change user password
    $scope.resetUserPassword = function() {
      $scope.success = $scope.error = null;

      $http.post('/puzzlehunt/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
        // If successful show success message and clear form
        $scope.passwordDetails = null;

        // Attach user profile
        PuzzleAuth.user = response;
        Authentication.user = null;

        // And redirect to password reset success page
        $location.path('/puzzle-hunt/password/reset-success');
      }).error(function(response) {
        $scope.error = response.message;
      });
    };
  }
]);
