'use strict';

var mongoose = require('mongoose');
var Team = mongoose.model('PuzzleHuntTeam');

exports.list = function(req, res){
	Team.find({}, function(err, teams){
		if(err){
			res.status(400).send(err);
		} else {
			res.json(teams);
		}
	});
};
