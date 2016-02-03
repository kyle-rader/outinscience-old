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


var MAX_TEAM_SIZE = 6;

/* Helper functions */
/**
 * Check a new team object against its schema. Finds missing/invalid fields.
 * @param team {Object} The team object to Check
 * @returns {null|Object} Null if valid object, else an object containing
 *     invalid fields.
 */
function validateNewPuzzleHuntTeam(team) {
  if (signupValidate(team)) {
    return null;
  } else {
    var retObj = {};
    var errors = signupValidate.errors;
    for (var i=0; i<errors.length; i++) {
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
function addUserToTeam(userId, teamId, callback) {
  User.update({_id: userId}, {teamId: teamId}, function(err, details){
    if (err) {
      callback(err);
    } else if (details.ok !== 1) {
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
  Team.findById(teamId, function(err, theTeam){
    if(err){
      callback(err);
    } else {
      // Verify that the userId is valid before adding them to the team
      User.findById(userId, function(err, user){
        if(err){
          callback({
            message: 'Unable to find user with given _id'
          });
        } else {
          // User exists in database
          if(theTeam.members.length >= MAX_TEAM_SIZE){
            callback({message: 'Unable to join; team is already full!'});
          } else {
            theTeam.members.push(user._id);
            if(theTeam.members.length === MAX_TEAM_SIZE){
              // Team can't be looking for members if it's full!
              theTeam.lookingForMembers = false;
            }
            theTeam.save(function(err, theTeam){
              if(err){ callback(err); }
              else{ callback(null, theTeam._id, user._id); }
            });
          }
        }
      });
    }
  });
}


/* Request-processing functions */

exports.createNew = function(req, res) {
  delete req.body.roles; // For security

  async.waterfall([
    // Validate the team fields in the request
    function(done) {
      var validationErrors = validateNewPuzzleHuntTeam(req.body);
      if (validationErrors === null) {
        // Check password length
        if (req.body.password.length < 8) {
          done({message: 'Team password must be at least 8 characters long!'});
        }
        if (!req.body.memberIds || req.body.memberIds.length === 0) {
          // Automatically add this user to their new team
          req.body.members = [req.body.ownerId];
        }
        done(null);

      } else {
        done({validationErrors: validationErrors});
      }
    },
    function(done) {
      // Make sure user is not an owner of a team, a member of another team
      // and the team name is not already taken.
      Team.findOne({
        $or: [{ownerId: req.user._id}, {teamName: req.body.teamName}, {memberIds: req.user._id} ]
      }, function(err, existingTeam) {
        if (err) {
          done({ message: err });
        }
        if (existingTeam) {
          if (existingTeam.ownerId.equals(req.user._id)) {
            done({ message: 'You already own the team "' + existingTeam.teamName +'"' });
          }
          else if (existingTeam.teamName === req.body.teamName) {
            done({ message: 'A team with that name already exists'});
          }
          else {
            done({ message: 'You are already on team "' + existingTeam.teamName +'"'});
          }
        } else {
          done(null);
        }
      });
    },
    // TODO: Add a step to find and create invitations or invites to join the site.
    // Save the new record in the database and get its _id
    function saveNewTeam(done) {
      var teamObject = new Team(req.body);
      
      teamObject.save(function(err, doc){
        if (err) {
          done(err);
        } else {
          done(null, doc);
        }
      });
    },
    // Update the owning user so that their teamId points to this new team
    function(team, done){
      addUserToTeam(team.ownerId, team._id, function(err){
        if(err){
          done(err);
        } else {
          res.send(team);
        }
      });
    },
  ],
  // Error handler
  function(err) {
    console.log(err);
    var error = err.validationErrors || err.errmsg;
    var ret = {
      message: err.message || 'Failed to save new team.',
      errors: error
    };
    res.status(400).send(ret);
  });
};

exports.join = function(res,req) {
  passport.authenticate('local', function(err, user, info) {
    if (err || !user) {
      res.status(400).send(info);
    } else {
      // Remove sensitive data before login
      user.password = undefined;
      user.salt = undefined;

      if(!res.body.teamId) {
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
