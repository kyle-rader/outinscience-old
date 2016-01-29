'use strict';

angular.module('puzzle-hunt').controller('PuzzleHuntSignUpController', ['$scope', 'PuzzleAuth', '$http', '$location',
  function($scope, PuzzleAuth, $http, $location) {

    // If user is signed in then redirect back home
    if (PuzzleAuth.user && PuzzleAuth.user._id) $location.path('/puzzle-hunt/dashboard');

    $scope.signup = function() {

      // If submitting before adding anything make an empty credentials object.
      if (!$scope.credentials) {
        $scope.credentials = {};
      }
      // Force boolean value
      $scope.credentials.tShirt = !!$scope.credentials.tShirt;

      // Remove anything but digits from phone number
      if ($scope.credentials.phone) {
        $scope.credentials.phone = $scope.credentials.phone.replace(/[\D]*/g, '');
      }

      $http.post('/puzzlehunt/auth/signup', $scope.credentials).success(function(response) {
        // If successful we assign the response to the global user model
        delete $scope.error;
        delete $scope.credentials;
        $scope.userForm.$setPristine();
        $scope.success = response.message;

      }).error(function(response) {
        $scope.error = response;
      });
    };

    $scope.fieldChanged = function(field) {
      if ($scope.error && $scope.error.errors[field]) {
        $scope.error.errors[field] = null;
      }
    };

  }
]);
