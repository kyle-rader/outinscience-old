'use strict';

angular.module('puzzle-hunt').controller('PuzzleHuntSignUpController', ['$scope', 'PuzzleAuth', '$http', '$location', '$window',
  function($scope, PuzzleAuth, $http, $location, $window) {
	$window.location.href = 'https://wwupuzzlehunt.com/register';
  }

]);
