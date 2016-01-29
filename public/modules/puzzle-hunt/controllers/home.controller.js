'use strict';

angular.module('puzzle-hunt').controller('PuzzleHuntController', ['$scope', 'PuzzleAuth', '$http',
	function($scope, PuzzleAuth, $http) {
		$scope.user = PuzzleAuth.user;

	}
]);
