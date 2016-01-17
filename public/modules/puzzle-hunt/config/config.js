'use strict';

// Configuring the core module's topbar.
angular.module('core').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'WWU Puzzle Hunt', 'puzzle-hunt', 'li-rb-red', '/puzzle-hunt', true, null, 4);

	}
]);
