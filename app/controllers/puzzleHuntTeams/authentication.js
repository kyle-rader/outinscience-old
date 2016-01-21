'use strict';

var mongoose = require('mongoose'),
	Team = mongoose.model('PuzzleHuntTeam'),
	User = mongoose.model('PuzzleHuntUser'),
	Validator = require('is-my-json-valid'),
	JSONSchema = require('../../models/puzzleHuntTeamsRequired.json');

var signupValidate = new Validator({
	type: 'object',
	properties: JSONSchema.properties,
	required: JSONSchema.required
}, {greedy: true});


exports.createNew = function(req, res){
	if(signupValidate(req.body)){
		if(req.body.members.length === 0){
			req.body.members = [req.body.owner_id];
		}
		var newTeam = new Team(req.body);
		User.update({_id: req.body.owner_id}, {teamId: newTeam._id}, function(err, details){
			console.log(details);
			if(err){
				res.status(404).send({message: 'Unable to update team owner\'s profile', error: err});
			} else if(details.nModified === 1){
				newTeam.save(function(err){
					if(err){
						console.log(err);
						res.status(500).send({
							message: 'Failed to create team! Please try a different team name.',
 							error: err
						});
					} else {
						res.status(200).send(newTeam);
					}
				});
			} else {
				res.status(404).send({message: 'Could not find team owner with given _id'});
			}

		});
	} else {
		var errMessage = {
			message: 'One or more invalid field(s)',
			errors: {}
		};
		var errors = signupValidate.errors;
		for(var i=0; i<errors.length; i++){
			var fieldName = errors[i].field.substr(5);
			errMessage.errors[fieldName] = fieldName + ' ' + errors[i].message;
		}
		res.status(400).send(errMessage);
	}
};

//exports.join = function(res,req){
//	passport.authenticate('local', function(err, user, info) {
//		if (err || !user) {
//			res.status(400).send(info);
//		} else {
//			// Remove sensitive data before login
//			user.password = undefined;
//			user.salt = undefined;
//
//			req.login(user, function(err) {
//				if (err) {
//					res.status(400).send(err);
//				} else if (!user.verified) {
//					req.logout();
//					res.status(400).send({message: 'No account with that email exists or that email is not yet verified.'});
//				} else {
//					res.json(user);
//				}
//			});
//		}
//	})(req, res, next);
//};
