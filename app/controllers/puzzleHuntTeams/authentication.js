'use strict';

var mongoose = require('mongoose'),
	async = require('async'),
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
 * @returns {Promise} Resolves to empty, fails to error object
 */
function addUserToTeam(userId, teamId, callback){
	User.update({_id: userId}, {teamId: teamId}, function(err, details){
		if(err){
			callback(err);
		} else if(details.nModified !== 0){
			callback({
				summary: 'Unable to update any PuzzleHuntUser documents matching the given _ids',
				nonFatal: true
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
 * @returns {Promise} Resolves to empty, fails to error object
 */
function addTeamMember(teamId, userId, callback){
	Team.update({_id: teamId}, {members: userId}, function(err, details){
		if(err){
			callback(err);
		} else if(details.nModified !== 1){
			callback({
				summary: 'Unable to update any documents matching the given _ids',
				nonFatal: true
			});
		} else {
			callback(null, teamId, userId);
		}
	});
}


/* Request-processing functions */

exports.createNew = function(req, res){
	delete req.body.roles; // For security reasons

	async.waterfall([
		// Validate the team fields in the request
		function(done){
			console.log("Tiem to validate");
			var validationErrors = validateNewPuzzleHuntTeam(req.body);
			if(validationErrors === null){
				if(req.body.members.length === 0){
					// Automatically add this user to their new team
					req.body.members = [req.body.owner_id];
				}
				done(null);
			} else {
				done(validationErrors);
			}
		},
		// Save the new record in the database and get its _id
		function saveNewTeam(done){
			console.log("Valid. save it.");
			var teamObject = new Team(req.body);
			teamObject.save(function(err, doc){
				console.log("Saved (maybe)");
				console.log(err);
				console.log(doc);
				if(err){
					done(err);
				} else {
					done(null, doc);
				}
			});
		},
		// Update the owner so that their teamId points to this new one
		function(team, done){
			console.log("last one");
			console.log(team);
			addUserToTeam(team.owner_id, team._id, function(err){
				console.log(err);
				if(err){
					done(err);
				} else {
					res.send(team);
				}
			});
		},
		// Error handler at end of chain.
		function(err){
			console.log(err);
			var ret = {
				message: 'Failed to save new team.',
				errors: err
			};
			res.status(400).send();
		}
	]);
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
