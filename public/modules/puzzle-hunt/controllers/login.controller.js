'use strict';

angular.module('puzzle-hunt').controller('PuzzleHuntLoginController', ['$scope', 'Authentication', '$http',
	function($scope, Authentication, $http) {
		$scope.user = Authentication.user;

	}
]);
