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
				link: 'http://www.wwu.edu/emarket/opensourceday/',
				info:
'<dl>\
	<dt>Suggested Resources</dt>\
	<dd>Github\'s Atom text editor. &#x21e8; <a target="_BLANK" href="https://atom.io/">https://atom.io/</a></dd>\
	<dt>Git Resources</dt>\
	<dd>Try Git tutorial. <a target="_BLANK" href="https://try.github.io">https://try.github.io</a></dd>\
	<dd>Git Bash. <a target="_BLANK" href="http://git-scm.com/downloads">http://git-scm.com/downloads</a></dd>\
	<dd>Github for Mac. <a target="_BLANK" href="https://mac.github.com/">https://mac.github.com/</a></dd>\
	<dd>Github for Windows. <a target="_BLANK" href="https://windows.github.com/">https://windows.github.com/</a></dd>\
	<dt>Suggested Projects</dt>\
	<dd>MediaWiki <a target="_blank" href="https://openhatch.org/projects/MediaWiki">https://openhatch.org/projects/MediaWiki</a> (lots of bite-size bugs, written in PHP)</dd>\
	<dd>openemr <a target="_blank" href="https://openhatch.org/projects/openemr">https://openhatch.org/projects/openemr</a> (social interest, looks beginner friendly)</dd>\
	<dd>OLPC <a target="_blank" href="https://openhatch.org/projects/OLPC">https://openhatch.org/projects/OLPC</a> (One Laptop per Child, social interest)</dd>\
	<dd>gedit <a target="_blank" href="http://openhatch.org/projects/gedit">http://openhatch.org/projects/gedit</a> (bite-sized bugs, documentation)</dd>\
	<dd>Mifos <a target="_blank" href="http://openhatch.org/projects/Mifos">http://openhatch.org/projects/Mifos</a> (social interest, written in Java)</dd>\
	<dd>Dreamwidth <a target="_blank" href="https://openhatch.org/projects/Dreamwidth">https://openhatch.org/projects/Dreamwidth</a> (lots of bite-sized bugs)</dd>\
	<dd>openspending <a target="_blank" href="https://openhatch.org/projects/openspending">https://openhatch.org/projects/openspending</a> (social/political interest, written in Python)</dd>\
	<dd>sympy <a target="_blank" href="https://openhatch.org/projects/sympy">https://openhatch.org/projects/sympy</a> (for math lovers, lots of bite-sized bugs, written in Python)</dd>\
	<dd>Firefox <a target="_blank" href="https://openhatch.org/projects/Firefox">https://openhatch.org/projects/Firefox</a> (lots of bite-sized bugs)</dd>\
</dl>'
			},
			{
				title: 'Whatcom Robotics Expo',
				day: 'Saturday',
				dayNum: 27,
				month: 'June',
				monthNum: 6,
				description: 'Whatcom county is full of different robotics groups!  Experience them all under one roof and build your path in engineering from Kindergarten to College!',
				link: 'https://www.facebook.com/events/1076239542392620/'
			}
		]
	}
]);
