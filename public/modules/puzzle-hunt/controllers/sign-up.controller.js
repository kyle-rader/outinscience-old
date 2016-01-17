'use strict';

angular.module('puzzle-hunt').controller('PuzzleHuntSignUpController', ['$scope', 'Authentication', '$http',
	function($scope, Authentication, $http) {
		$scope.user = Authentication.user;

	}
]);
