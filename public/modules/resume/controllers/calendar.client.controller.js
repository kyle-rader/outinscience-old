'use strict';

angular.module('resume').controller('CalendarController', ['$scope',
	function($scope) {
		$scope.calendarWidth = window.innerWidth - Math.round((window.innerWidth * 0.2 ));
		if ($scope.calendarWidth > 1180 ) $scope.calendarWidth = 1180;
	}
]);