'use strict';

var mongoose = require('mongoose');
var Team = mongoose.model('PuzzleHuntTeam');
var User = mongoose.model('PuzzleHuntUser');

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
	if (!authed) {
		return res.status(400).send({message: 'Not logged in'});
	}
  else if (!req.params.teamId || req.params.teamId.length === 0) {
    return res.status(400).send({message: 'Missing paramter "teamId"'});
  }

  // 2. You on this team?
  Team.findById(req.params.teamId, function(err, team) {
    if (err) {
      return res.status(400).send(err);
    }
    if (team._id.toString() === req.params.teamId) {
      // remove team password for security
      team.password = undefined;
      team.members = null;

      User.find({_id: {$in: team.memberIds}}, '_id displayName firstName lastName major phone email').lean().exec(function(err, members) {
        if (err) {
          return res.status(400).send(err);
        }
        members = members.map(function(member) {
          member.salt = member.password = undefined;
          return member;
        });

        return res.send({team: team, members: members});
      });
    }
    else {
      // You ain't on this team yo, GTFO
      return res.status(400).send({message: 'You are not on this team!'});
    }
  });
};