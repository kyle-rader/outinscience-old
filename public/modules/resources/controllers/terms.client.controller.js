'use strict';

angular.module('resources').controller('TermsController', ['$scope', '$http',
	function($scope, $http) {

		$http.post('/terms/getTerms').success(function(data, status, headers, config) {
			$scope.terms = data;
		});
	}
]);
