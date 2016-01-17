'use strict';

angular.module('puzzle-hunt').controller('PuzzleHuntPuzzlesController', ['$scope', 'Authentication', '$http',
	function($scope, Authentication, $http) {
		$scope.user = Authentication.user;

	}
]);
