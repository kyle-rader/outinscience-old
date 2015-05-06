'use strict';

angular.module('events').controller('EventsController', ['$scope',
	function($scope) {

		// TODO: Get events from a database or something.  Don't hard code.
		$scope.events = [
			{
				title: 'WWU Open Source Day',
				day: 'Saturday',
				dayNum: 9,
				month: 'May',
				monthNum: 5,
				description: 'Dive into the world of open source and see how you can contribute to projects and make a difference today!',
				link: 'https://cse.wwu.edu/computer-science/event/open-source-day'
			},
			{
				title: 'Whatcom Robotics Expo',
				day: 'Saturday',
				dayNum: 27,
				month: 'June',
				monthNum: 6,
				description: 'Whatcom county is full of different K-12 robotics groups.  Experience them all under one roof and build your path in engineering from Kindergarten to College!',
				link: 'https://www.facebook.com/events/1076239542392620/'
			}
		]
	}
]);
