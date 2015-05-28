'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$location', '$http',
	function($scope, Authentication, $location, $http) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

	}
]);
