'use strict';

angular.module('puzzle-hunt').controller('PuzzleHuntSignInController', ['$scope', 'Authentication', '$http',
	function($scope, Authentication, $http) {
		$scope.user = Authentication.user;

	}
]);
