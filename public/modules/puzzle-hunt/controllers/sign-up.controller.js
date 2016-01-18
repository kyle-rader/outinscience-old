'use strict';

angular.module('puzzle-hunt').controller('PuzzleHuntSignUpController', ['$scope', 'Authentication', '$http', '$location',
	function($scope, Authentication, $http, $location) {
		$scope.user = Authentication.user;

    // If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/#!/puzzle-hunt/dashboard');

    $scope.signup = function() {
			$http.post('/puzzlehunt/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				delete $scope.error;
				delete $scope.credentials;
				$scope.userForm.$setPristine();
				$scope.success = response.message;

			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
