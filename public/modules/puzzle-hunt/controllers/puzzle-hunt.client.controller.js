'use strict';

angular.module('the-out-list').controller('PuzzleHuntController', ['$scope', 'Authentication', '$http',
	function($scope, Authentication, $http) {
		$scope.user = Authentication.user;

	}
]);
