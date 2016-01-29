'use strict';

angular.module('puzzle-hunt').controller('PuzzleHuntInfoController', ['$scope', 'PuzzleAuth', '$http',
	function($scope, PuzzleAuth, $http) {
		$scope.user = PuzzleAuth.user;

	}
]);
