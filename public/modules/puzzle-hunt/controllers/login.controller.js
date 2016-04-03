'use strict';

angular.module('puzzle-hunt').controller('PuzzleHuntLoginController', ['$scope', 'PuzzleAuth', 'Authentication', '$http', '$location', '$window',
  function($scope, PuzzleAuth, Authentication, $http, $location, $window) {
	$window.location.href = 'https://wwupuzzlehunt.com/login';
    };

  }
]);
