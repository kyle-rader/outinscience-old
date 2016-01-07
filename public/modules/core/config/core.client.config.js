'use strict';

// Configuring the core module's topbar.
angular.module('the-out-list').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'The Team', 'team', 'li-rb-blue', '/team', true);

	}
]);
