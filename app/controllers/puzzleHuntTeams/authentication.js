'use strict';

var mongoose = require('mongoose'),
	async = require('async'),
	passport = require('passport'),
	Team = mongoose.model('PuzzleHuntTeam'),
	User = mongoose.model('PuzzleHuntUser'),
	Validator = require('is-my-json-valid'),
	JSONSchema = require('../../models/puzzleHuntTeamsRequired.json');

var signupValidate = new Validator({
	type: 'object',
	properties: JSONSchema.properties,
	required: JSONSchema.required
}, {greedy: true});


/* Helper functions */
/**
 * Check a new team object against its schema. Finds missing/invalid fields.
 * @param team {Object} The team object to Check
 * @returns {null|Object} Null if valid object, else an object containing
 *     invalid fields.
 */
function validateNewPuzzleHuntTeam(team){
	if(signupValidate(team)){
		return null;
	} else {
		var retObj = {};
		var errors = signupValidate.errors;
		for(var i=0; i<errors.length; i++){
			var fieldName = errors[i].field.substr(5);
			retObj[fieldName] = fieldName + ' ' + errors[i].message;
		}

		return retObj;
	}
}

/**
 * Update a PuzzleHuntUser document so that their "teamId" is the id given.
 * @param userId {String} The _id of the user document
 * @param teamId {String} The _id of the team document
 * @param callback {function} Gets called upon completion. First argument is
 *     error, if any, followed by userId and teamId.
 */
function addUserToTeam(userId, teamId, callback){
	User.update({_id: userId}, {teamId: teamId}, function(err, details){
		if(err){
			callback(err);
		} else if(details.nModified !== 1){
			callback({
				errmsg: 'Unable to update any PuzzleHuntUser documents matching the given _ids',
			});
		} else {
			callback(null, userId, teamId);
		}
	});
}

/**
 * Update a PuzzleHuntTeam's "members" array to include the given user _id
 * @param teamId {String} The _id of the team document
 * @param userId {String} The _id of the user document
 * @param callback {function} Gets called upon completion. First argument is
 *     error, if any, followed by teamId and userId.
 */
function addTeamMember(teamId, userId, callback){
	Team.update({_id: teamId}, {members: userId}, function(err, details){
		if(err){
			callback(err);
		} else if(details.nModified !== 1){
			callback({
				errmsg: 'Unable to update any PuzzleHuntTeam documents matching the given _ids',
			});
		} else {
			callback(null, teamId, userId);
		}
	});
}


/* Request-processing functions */

exports.createNew = function(req, res){
	delete req.body.roles; // For security

	async.waterfall([
		// Validate the team fields in the request
		function(done){
			var validationErrors = validateNewPuzzleHuntTeam(req.body);
			if(validationErrors === null){
				if(req.body.members.length === 0){
					// Automatically add this user to their new team
					req.body.members = [req.body.owner_id];
				}
				done(null);
			} else {
				done({validationErrors: validationErrors});
			}
		},
		// Save the new record in the database and get its _id
		function saveNewTeam(done){
			var teamObject = new Team(req.body);
			teamObject.save(function(err, doc){
				if(err){
					done(err);
				} else {
					done(null, doc);
				}
			});
		},
		// Update the owner so that their teamId points to this new one
		function(team, done){
			addUserToTeam(team.owner_id, team._id, function(err){
				if(err){
					done(err);
				} else {
					res.send(team);
				}
			});
		},
	],
	// Error handler
	function(err){
		err = err.validationErrors || err.errmsg;
		var ret = {
			message: 'Failed to save new team.',
			errors: err
		};
		res.status(400).send(ret);
	});
};

exports.join = function(res,req){
	passport.authenticate('local', function(err, user, info) {
		if (err || !user) {
			res.status(400).send(info);
		} else {
			// Remove sensitive data before login
			user.password = undefined;
			user.salt = undefined;

			if(!res.body.teamId){
				res.status(400).send('No teamId provided.');
			} else {
				async.waterfall([
					function(done){
						addUserToTeam(user._id, req.body.teamId, done);
					},
					function(userId, teamId, done){
						addTeamMember(teamId, userId, done);
					}
				], function(err){
					err = err.message || err.errmsg || null;
					res.status(400).send({
						message: 'Unable to join team with given _id',
						details: err
					});
				});
			}
		}
	})(req, res);
};
