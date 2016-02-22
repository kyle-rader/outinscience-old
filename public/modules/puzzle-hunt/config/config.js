'use strict';

// Configuring the core module's topbar.
angular.module('core').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'WWU Puzzle Hunt', 'puzzle-hunt', 'li-rb-red', '/puzzle-hunt', true, null, 4);

	}
]);

angular.module('puzzle-hunt').config(['$httpProvider',
  function($httpProvider) {
    // Set the httpProvider "not authorized" interceptor
    $httpProvider.interceptors.push(['$q', '$location', 'PuzzleAuth',
      function($q, $location, PuzzleAuth) {
        return {
          responseError: function(rejection) {
            switch (rejection.status) {
              case 401:
                // Deauthenticate the global user
                PuzzleAuth.user = null;

                // Redirect to signin page
                $location.path('signin');
                break;
              case 403:
                // Add unauthorized behaviour
                break;
            }

            return $q.reject(rejection);
          }
        };
      }
    ]);
  }
]);
