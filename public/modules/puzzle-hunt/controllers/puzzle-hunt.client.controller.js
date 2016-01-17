'use strict';

angular.module('puzzle-hunt').controller('PuzzleHuntController', ['$scope', 'Authentication', '$http',
	function($scope, Authentication, $http) {
		$scope.user = Authentication.user;
	}
]);
