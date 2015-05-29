'use strict';

// Configuring the core module's topbar.
angular.module('core').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'The Team', 'team', '', '/team', true);

	}
]);
