'use strict';

var mongoose = require('mongoose');
var Team = mongoose.model('PuzzleHuntTeam');
var User = mongoose.model('PuzzleHuntUser');
var Invite = mongoose.model('PuzzleHuntInvite');

/**
 * Authed - checks that a puzzle hunt user is authed.
 */
function authed(req) {
	return req.user && req.user._id && req.user.userType && req.user.userType === 'puzzleHuntUser';
}

exports.list = function(req, res) {
  var projection = '_id teamName ownerId memberIds lookingForMembers';
  Team.find({}, projection, function(err, teams) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.json(teams);
    }
  });
};

exports.getTeam = function(req, res) {
	// 1. You authed?
	if (!authed(req)) {
		return res.status(400).send({message: 'Not logged in'});
	}

  var user = req.user;

  if (!user.teamId) {
    return res.status(400).send({message: 'You are not on a team!'});
  }

  // 2. Get User's team.
  Team.findById(user.teamId, {password: false, salt: false}, function(err, team) {
    if (err) {
      return res.status(400).send(err);
    }

    User.find({_id: {$in: team.memberIds}}, '_id displayName firstName lastName major phone email').lean().exec(function(err, members) {
      if (err) {
        return res.status(400).send(err);
      }
      members = members.map(function(member) {
        member.salt = member.password = undefined;
        return member;
      });

      // Get Pending Invites
      Invite.find({teamId: team._id, accepted: false}, function(err, invites) {
        if (err)
          return res.status(400).send(err);
        return res.send({team: team, members: members, invites: invites});
      });
    });
  });
};
