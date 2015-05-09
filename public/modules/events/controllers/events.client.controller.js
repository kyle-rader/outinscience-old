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
'<strong>Max Bronsema\'s Open Source Speech</strong><br><a target="_blank" href="http://slides.com/maxbronsema/deck-1">http://slides.com/maxbronsema/deck-1</a> \
<dl>\
	<dt>Suggested Resources</dt>\
	<dd>Github\'s Atom text editor. <br><a target="_BLANK" href="https://atom.io/">https://atom.io/</a></dd>\
	<dt>Git Resources</dt>\
	<dd>Try Git tutorial. <br><a target="_BLANK" href="https://try.github.io">https://try.github.io</a></dd>\
	<dd>Git Bash. <br><a target="_BLANK" href="http://git-scm.com/downloads">http://git-scm.com/downloads</a></dd>\
	<dd>Github for Mac. <br><a target="_BLANK" href="https://mac.github.com/">https://mac.github.com/</a></dd>\
	<dd>Github for Windows. <br><a target="_BLANK" href="https://windows.github.com/">https://windows.github.com/</a></dd>\
	<dt>Dedicated Table Projects</dt>\
	<dd><strong>Drupal</strong> (Jennifer Dixey) <br><a target="_blank" href="https://www.drupal.org/">https://www.drupal.org/</a></dd>\
	<dd><strong>KeyMail (NachoBits)</strong> (Aaron Griffin) <br><a target="_blank" href="https://github.com/NachoBits/keymail">https://github.com/NachoBits/keymail</a></dd>\
	<dd><strong>Language of Languages</strong> (Jamie & Andi Douglass) <br><a target="_blank" href="https://github.com/jamiedouglass/LanguageOfLanguages">https://github.com/jamiedouglass/LanguageOfLanguages</a></dd>\
	<dd><strong>Able Player</strong> (Terry Thompson) <br><a target="_blank" href="https://github.com/ableplayer/ableplayer">https://github.com/ableplayer/ableplayer</a></dd>\
	<dd><strong>cpython</strong> (Alex Lord) <br><a target="_blank" href="https://openhatch.org/search/?q=&language=Python">https://openhatch.org/search/?q=&language=Python</a></dd>\
	<dt>Other Suggested Projects</dt>\
	<dd><strong>MediaWiki</strong> (lots of bite-size bugs, written in PHP) <br><a target="_blank" href="https://openhatch.org/projects/MediaWiki">https://openhatch.org/projects/MediaWiki</a> </dd>\
	<dd><strong>openemr</strong> (social interest, looks beginner friendly) <br><a target="_blank" href="https://openhatch.org/projects/openemr">https://openhatch.org/projects/openemr</a> </dd>\
	<dd><strong>OLPC</strong> (One Laptop per Child, social interest) <br><a target="_blank" href="https://openhatch.org/projects/OLPC">https://openhatch.org/projects/OLPC</a> </dd>\
	<dd><strong>gedit</strong> (bite-sized bugs, documentation) <br><a target="_blank" href="http://openhatch.org/projects/gedit">http://openhatch.org/projects/gedit</a> </dd>\
	<dd><strong>Mifos</strong> (social interest, written in Java) <br><a target="_blank" href="http://openhatch.org/projects/Mifos">http://openhatch.org/projects/Mifos</a> </dd>\
	<dd><strong>Dreamwidth</strong> (lots of bite-sized bugs) <br><a target="_blank" href="https://openhatch.org/projects/Dreamwidth">https://openhatch.org/projects/Dreamwidth</a> </dd>\
	<dd><strong>openspending</strong> (social/political interest, written in Python) <br><a target="_blank" href="https://openhatch.org/projects/openspending">https://openhatch.org/projects/openspending</a> </dd>\
	<dd><strong>sympy</strong> (for math lovers, lots of bite-sized bugs, written in Python) <br><a target="_blank" href="https://openhatch.org/projects/sympy">https://openhatch.org/projects/sympy</a> </dd>\
	<dd><strong>Firefox</strong> (lots of bite-sized bugs) <br><a target="_blank" href="https://openhatch.org/projects/Firefox">https://openhatch.org/projects/Firefox</a> </dd>\
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
