'use strict';

angular.module('puzzle-hunt').controller('PuzzleHuntInfoController', ['$scope', 'Authentication', '$http',
	function($scope, Authentication, $http) {
		$scope.user = Authentication.user;

	}
]);
