'use strict';

var mongoose = require('mongoose'),
  async = require('async'),
  passport = require('passport'),
  Team = mongoose.model('PuzzleHuntTeam'),
  User = mongoose.model('PuzzleHuntUser'),
  Invite = mongoose.model('PuzzleHuntInvite'),
  config = require('../../../config/config'),
  Validator = require('is-my-json-valid'),
  emailValidator = require('validator'),
  JSONSchema = require('../../models/puzzleHuntTeamsRequired.json'),
  nodemailer = require('nodemailer'),
  mg = require('nodemailer-mailgun-transport');

var auth = {
  auth: {
    api_key: config.mailer.api_key,
    domain: config.mailer.domain
  }
};
var nodemailerMailgun = nodemailer.createTransport(mg(auth));

var signupValidate = new Validator({
  type: 'object',
  properties: JSONSchema.properties,
  required: JSONSchema.required
}, {greedy: true});


var MAX_TEAM_SIZE = 6;
var EMAIL_DOMAIN = '@kylerader.ninja';

/**
 * Check a new team object against its schema. Finds missing/invalid fields.
 * @param team {Object} The team object to Check
 * @returns {null|Object} Null if valid object, else an object containing
 *     invalid fields.
**/
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
**/
function addUserToTeam(userId, teamId, callback) {
  User.update({_id: userId}, {$set: {teamId: teamId}}, function(err, details) {
    if (err) {
      callback(err);
    }
    else if (details.ok !== 1) {
      callback({
        message: 'Unable to update any PuzzleHuntUser documents matching the given _ids',
      });
    }
    else {
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
**/
function addTeamMember(teamId, userId, callback) {
  Team.findById(teamId, function(err, theTeam) {
    if(err){
      callback(err);
    } else {
      // Verify that the userId is valid before adding them to the team
      User.findById(userId, function(err, user) {
        if(err){
          callback({
            message: 'Unable to find user with given _id'
          });
        } else {
          // User exists in database
          if (theTeam.memberIds.length >= MAX_TEAM_SIZE) {
            callback({message: 'Unable to join; team is already full!'});
          }
          else {
            theTeam.memberIds.push(user._id);
            if (theTeam.memberIds.length === MAX_TEAM_SIZE) {
              // Team can't be looking for memberIds if it's full!
              theTeam.lookingForMembers = false;
            }
            theTeam.save(function(err, theTeam) {
              if (err) { callback(err); }
              else { callback(null, theTeam._id, user._id); }
            });
          }
        }
      });
    }
  });
}

/**
 * Create an invite for the given user to join the given team and email the user.
 * @param teamId {String} The _id of the team initiating the invite.
 * @param user {String} The WWU username of the student to invite.
 * @return true if Invitation is created and sent, false otherwise.
**/
function inviteUser(teamId, teamName, username, req, res, callback) {
  var response = {
    success: true,
    err: null
  };
  async.waterfall([
    // Create Invitation
    function(done) {
      var invite = new Invite({
        teamId: teamId,
        email: username + EMAIL_DOMAIN
      });
      if (!invite) {
        done({message: 'Failed to create invitation'});
      } else {
        done(null, invite);
      }
    },
    // Save Invitation
    function(invite, done) {
      invite.save(function(err) {
        if (err)
          done(err);
        else
          done(null, invite);
      });
    },
    // Create invite email
    function(invite, done) {
      res.render('templates/puzzle-hunt-team-invitation-email', {
        team: teamName,
        appName: config.app.title,
        loginUrl: req.protocol + '://' + req.headers.host + '/#!/puzzle-hunt/login',
        signupUrl: req.protocol + '://' + req.headers.host + '/#!/puzzle-hunt/sign-up'
      }, function(err, emailHTML) {
        done(err, invite, emailHTML, 'WWU Puzzle Hunt: Team Invitation');
      });
    },
    // Email Invite
    function(invite, html, subject, done) {
      nodemailerMailgun.sendMail({
        from: config.mailer.from,
        to: invite.email,
        subject: subject,
        'h:Reply-To': config.mailer.reply_to,
        html: html,
        text: html
      }, function(err) {
        if (err) {
          done(err);
          return;
        }
        // Emailed successfully - callback to tell async.map the good result.
        callback(null, response);
      });
    }
  ], function(err) {
    if (err) {
      response.err = err;
      response.success = false;
      console.log('Failed to send invite email.', err);
    }
    // Email failed - callback to tell async.map the bad result.
    callback(null, response);
  });
}

/**
 * Create New Team
**/
exports.createNew = function(req, res) {
  // For security
  delete req.body.roles;
  if (!(req.user && req.user._id && req.user.userType === 'puzzleHuntUser' && req.user._id.toString() === req.body.ownerId)) {
    return res.status(401).send({message: 'You don\'t have permission to do that'});
  }

  async.waterfall([
    // Validate the team fields in the request
    function(done) {
      var validationErrors = validateNewPuzzleHuntTeam(req.body);
      if (validationErrors === null) {
        // Check password length
        if (req.body.password.length < 8) {
          done({message: 'Team password must be at least 8 characters long!'});
          return;
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
    // Make sure user is not an owner of a team, a member of another team
    // and the team name is not already taken.
    function(done) {
      Team.findOne({
        $or: [{ownerId: req.user._id}, {teamName: req.body.teamName}, {memberIds: req.user._id} ]
      }, function(err, existingTeam) {
        if (err) {
          done({ message: err });
          return;
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
    // Save the new record in the database and get its _id
    function saveNewTeam(done) {
      var teamObject = new Team(req.body);

      teamObject.shouldHash = true;
      teamObject.save(function(err, docs) {
        if (err) {
          done(err);
        } else {
          done(null, docs);
        }
      });
    },
    // Create invitations (before setting team owner because if this fails we need to un-make the team object.)
    function(team, done) {
      // Check for members at all - if none - skip
      if (!req.body.inviteMembers) {
        done(null, team);
        return;
      }

      var users = req.body.inviteMembers.match(/\S+/g);
      
      // if no users - skip
      if (!users) {
        done(null, team);
        return;
      }

      // Check for less than 5 user names.
      if (users.length > 5) {
        team.remove();
        done({message: 'You can only invite up to 5 more teammates!'});
        return;
      }

      // Check for valid emails
      for (var i = 0; i < users.length; i++) {
        if (!emailValidator.isEmail(users[i] + EMAIL_DOMAIN)) {
          team.remove();
          done({message: '"' + users[i] + '" is not a valid email address!'});
          return;
        }
      }

      async.map(users,
        // iteratee function
        function(user, callback) {
          inviteUser(team._id, team.teamName, user, req, res, callback);
        },
        // final function
        function(err, results) {

          // throw immediate error
          if (err) {
            team.remove();
            done(err);
            return;
          }

          // check results for any failures
          for (var i = 0; i < results.length; i++) {
            if (!results[i].success && results[i].err) {
              team.remove();
              done(results[i].err);
              return;
            }
          }

          // No fails
          done(null, team);
        }
      );
    },
    // Update the owning user so that their teamId points to this new team
    function(team, done) {
      addUserToTeam(team.ownerId, team._id, function(err) {
        if (err) {
          done(err);
        } else {
          // All good send back team.
          res.send(team);
        }
      });
    },
  ],
  // Error handler
  function(err) {
    if(err) {
      var error = err.validationErrors || err.errmsg;
      var ret = {
        message: err.message || 'Failed to save new team.',
        errors: error
      };
      console.log(err);
      res.status(400).send(ret);
    }    
  });
};

/**
 * Join Team By Password
**/
exports.joinTeamByPassword = function(req, res) {
  // 1. Is user authed?
  if (!(req.user && req.user._id && req.user.userType === 'puzzleHuntUser')) {
    return res.status(400).send({message: 'You must be logged in to do that'});
  }
  else if (!(req.params.teamId && req.params.teamId.length > 0)) {
    return res.status(400).send({message: 'Must submit a valid teamId.'});
  }
  else if (!(req.body.password && req.body.password.length > 0)) {
    return res.status(400).send({message: 'Must submit a valid password.'});
  }

  async.waterfall([
    // 1. Get Team
    function(done) {
      Team.findById(req.params.teamId, function(err, team) {
        if (err) {
          done(err);
          return;
        }
        done(null, team);
      });
    },
    function (team, done) {
      if (!team.lookingForMembers) {
        done({message: 'This team is not looking for members'});
        return;
      }
      if (!team.authenticate(req.body.password)) {
        done({message: 'Incorrect team password'});
        return;
      }
      addUserToTeam(req.user._id, team._id, done);
    },
    function (userId, teamId, done) {
      addTeamMember(teamId, userId, done);
    }
  ], function (err, result) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send({message: 'Joined!'});
    }
  });
};

/**
 * Join Team By Invite
**/
exports.joinTeamByInvite = function(req, res) {
  // 1. Is user authed?
  if (!(req.user && req.user._id && req.user.userType === 'puzzleHuntUser')) {
    return res.status(400).send({message: 'You must be logged in to do that'});
  }
  else if (!(req.params.teamId && req.params.teamId.length > 0)) {
    return res.status(400).send({message: 'Must submit a valid teamId.'});
  }

  async.waterfall([
    // 1. Get Team
    function(done) {
      Team.findById(req.params.teamId, function(err, team) {
        if (err) {
          done(err);
          return;
        }
        done(null, team);
      });
    },
    // 2. Get the Invite and say accepted.
    function(team, done) {
      Invite.findOne({email: req.user.email, teamId: team._id}, function(err, invite) {
        if (err) {
          done(err);
          return;
        } else if (!invite) {
          done({message: 'You don\'t have an invite from this team'});
          return;
        }
        invite.accepted = true;
        invite.acceptedOn = Date.now;
        invite.save(function(err, invite) {
          if (err) {
            done(err);
            return;
          }
          done(null, team);
        });
      });
    },
    // 3. Add the user to the team.
    function (team, done) {
      addUserToTeam(req.user._id, team._id, done);
    },
    function (userId, teamId, done) {
      addTeamMember(teamId, userId, done);
    }
  ], function (err, result) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send({message: 'Joined!'});
    }
  });
};
