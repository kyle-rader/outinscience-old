'use strict';

angular.module('puzzle-hunt').controller('PuzzleHuntPuzzlesController', ['$scope', 'PuzzleAuth', '$http',
	function($scope, PuzzleAuth, $http) {
		$scope.user = PuzzleAuth.user;

	}
]);
