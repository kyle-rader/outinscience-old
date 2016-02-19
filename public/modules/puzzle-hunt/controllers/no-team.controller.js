'use strict';

angular.module('puzzle-hunt').controller('PuzzleHuntNoTeamController', ['$scope', 'PuzzleAuth', '$http', '$location',
  function($scope, PuzzleAuth, $http, $location) {

    // If user is not signed in then redirect back home
    if (!PuzzleAuth.user || !PuzzleAuth.user._id) return $location.path('/puzzle-hunt/login');

    $scope.user = PuzzleAuth.user;
    $scope.hasTeam = $scope.user.teamId !== null;

    // If they have a team - go to team page
    if ($scope.hasTeam) return $location.path('/puzzle-hunt/team');

    // Define newTeam object.
    $scope.newTeam = {};

    // TODO: Get Actual team List (if needed) from server

    // Create New Team function
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

    // Join A Team function
    $scope.joinTeam = function(obj) {
      console.log('Join Team!', obj);
    };
  }
]);
