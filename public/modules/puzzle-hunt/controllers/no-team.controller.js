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

    // Get Team List:
    $http.get('/puzzlehunt/teams')
    .success(function(res) {
      $scope.teams = res;
      $scope.teamRef = [];

      res.forEach(function(team) {
        $scope.teamRef[team._id] = team.teamName;
      });
    })
    .error(function(res) {
      console.log(res);
    });

    // Get Invites
    $http.get('/puzzlehunt/invites')
    .success(function(res) {
      $scope.invites = res;
    })
    .error(function(res) {
      console.log(res);
    });

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

      // Make lookingForMembers a boolean
      $scope.newTeam.lookingForMembers = !!$scope.newTeam.lookingForMembers;

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

    // Join A Team by password function
    $scope.joinTeam = function(team) {
      $http.post('/puzzlehunt/team/' + team._id + '/password-join', {
        password: team.password
      })
      .success(function(res) {
        PuzzleAuth.user.teamId = team._id;
        team.success = res.message;
        team.error = null;
      })
      .error(function(res) {
        team.error = res.message;
      });
    };

    $scope.acceptInvite = function(invite) {
      $http.post('/puzzlehunt/team/' + invite.teamId + '/accept-invite')
      .success(function(res) {
        PuzzleAuth.user.teamId = invite.teamId;
        invite.success = res.message;
        invite.error = null;
      })
      .error(function(res) {
        invite.error = res.message;
      });
    };

  }
]);
