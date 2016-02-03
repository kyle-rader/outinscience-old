'use strict';

angular.module('puzzle-hunt').controller('PuzzleHuntNoTeamController', ['$scope', 'PuzzleAuth', '$http', '$location',
  function($scope, PuzzleAuth, $http, $location) {
    $scope.user = PuzzleAuth.user;
    $scope.hasTeam = $scope.user.teamId !== null;
    $scope.newTeam = {};

    // TODO: Get Actual team List (if needed) from server
    $scope.teams = [
      {
        name: 'The puzzlers',
        id: '2l345b23k5hrfssga74of93g78go8yrbfuw'
      },
      {
        name: 'The bashers',
        id: '94389ghnp39hg93'
      },
      {
        name: 'Team Rocket',
        id: '24702984ugv934fb4'
      }
    ];

    // If user is signed in then redirect back home
    if (!PuzzleAuth.user || !PuzzleAuth.user._id) $location.path('/puzzle-hunt/login');

    // Create new Team function
    $scope.createTeam = function() {

      // Verify they've enetered something.
      if (!$scope.newTeam) {
        $scope.error = {
          message: 'You must enter new team info!'
        };
        return;
      }
      else {
        $scope.error = null;
      }

      // Set the new team owner's id
      $scope.newTeam.ownerId = $scope.user._id;

      // Add the owner as a member
      $scope.newTeam.memberIds = [$scope.user._id];

      $http.post('/puzzlehunt/auth/createTeam', $scope.newTeam).success(function(response) {
        // If successful we assign user's new team id.
        // This will cause the normal Team Page to render.
        $scope.user.teamId = response._id;
        $scope.success = {
          message: response.teamName + ' has been created!'
        };
        $scope.error = null;

      }).error(function(response) {
        $scope.error = response;
      });
    };

  }
]);
