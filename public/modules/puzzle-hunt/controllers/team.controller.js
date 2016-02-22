'use strict';

angular.module('puzzle-hunt').controller('PuzzleHuntTeamController', ['$scope', 'PuzzleAuth', '$http', '$location',
  function($scope, PuzzleAuth, $http, $location) {

    // If user is not signed in then redirect back home
    if (!PuzzleAuth.user || !PuzzleAuth.user._id) return $location.path('/puzzle-hunt/login');

    $scope.user = PuzzleAuth.user;
    $scope.hasTeam = $scope.user.teamId !== null;

    // If they do not have a team - go to no team page
    if (!$scope.hasTeam) return $location.path('/puzzle-hunt/no-team');

    // Get team:
    $http.get('/puzzlehunt/team')
    .success(function(response) {
      $scope.team = response.team;
      $scope.members = response.members;
      $scope.invites = response.invites;
    })
    .error(function(response) {
      $scope.error = response;
    });

  }
]);
