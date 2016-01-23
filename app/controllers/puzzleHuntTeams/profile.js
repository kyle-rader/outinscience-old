'use strict';

var mongoose = require('mongoose');
var Team = mongoose.model('PuzzleHuntTeam');

exports.list = function(req, res){
	var projection = 'teamName owner_id verified approved members lookingForMembers';
	Team.find({}, projection, function(err, teams){
		if(err){
			res.status(400).send(err);
		} else {
			res.json(teams);
		}
	});
};
