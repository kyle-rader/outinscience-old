'use strict';

angular.module('users').controller('ConfirmEmailInvalidController', ['$scope', '$http', '$location', 'Authentication', '$timeout',
  function($scope, $http, $location, Authentication, $timeout) {
    $scope.authentication = Authentication;
    $scope.countDown = 10;

    $scope.onTimeout = function() {
      $scope.countDown -= 1;
      if ($scope.countDown > 0)
        $timeout($scope.onTimeout, 1000);
      else
      $location.path('/');
    };

    $timeout($scope.onTimeout, 1000);
  }
]);
