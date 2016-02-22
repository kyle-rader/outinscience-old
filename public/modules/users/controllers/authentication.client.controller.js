'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication', 'PuzzleAuth',
  function($scope, $http, $location, Authentication, PuzzleAuth) {
    $scope.authentication = Authentication;
    $scope.puzzleAuth = PuzzleAuth;

    // If user is signed in then redirect back home
    if ($scope.authentication.user) $location.path('/');

    $scope.signup = function() {
      $http.post('/auth/signup', $scope.credentials).success(function(response) {
        // If successful we assign the response to the global user model
        delete $scope.error;
        delete $scope.credentials;
        $scope.userForm.$setPristine();
        $scope.success = response.message;

      }).error(function(response) {
        $scope.error = response.message;
      });
    };

    $scope.signin = function() {
      $http.post('/auth/signin', $scope.credentials).success(function(response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;
        // Remove puzzle hunt user if it exist
        $scope.puzzleAuth.user = null;

        // And redirect to the index page
        $location.path('/the-out-list');

      }).error(function(response) {
        $scope.error = response.message;
      });
    };
  }
]);
