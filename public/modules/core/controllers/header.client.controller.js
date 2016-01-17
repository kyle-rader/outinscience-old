'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus', '$location', '$http',
	function($scope, Authentication, Menus, $location, $http) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;

    $scope.$location = $location;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});

		$scope.formData = {};

		$scope.emailSubscribe = function() {
			/*
			$http.post($location.protocol() + '://' + $location.host() + '/mail/subscribe/d7142be008/' + $scope.formData.email)
			.success(function(data, status, headers, config) {
				if(!data.error) {
					$scope.formData.success = $scope.formData.email + ' has been subscribed to the CodeLily mailing list.  Thanks! We look forward to talking with you soon ^_^';
				} else {
					$scope.formData.error = data.error;
				}
			})
			.error(function(data, status, headers, config) {
				$scope.formData.error = data.error;
			});
			*/
		};

	}
]);
