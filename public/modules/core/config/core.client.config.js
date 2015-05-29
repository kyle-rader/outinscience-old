'use strict';

// Configuring the core module's topbar.
angular.module('core').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'The Team', 'team', 'li-rb-purple', '/team', true);
		Menus.addMenuItem('topbar', 'The Out list', 'out-list', 'li-rb-blue', '/the-out-list', true);

	}
]);
