'use strict';

// Resume module config
angular.module('resume').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Resume', 'resume', '', '/resume', true);
		Menus.addMenuItem('topbar', 'Calendar', 'calendar', '', '/calendar', true);
	}
]);