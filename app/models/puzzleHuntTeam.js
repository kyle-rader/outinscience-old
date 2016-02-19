'use strict';

/**
 * Team schema for WWU Puzzle Hunt
 * @author Noah Strong <strongn@wwu.edu>
 */

var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  crypto = require('crypto');

/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function(property) {
  return (!this.updated || property.length);
};

/**
 * A Validation function for local strategy password
 */
var validateLocalStrategyPassword = function(password) {
  return (password && password.length >= 8);
};

var PuzzleHuntTeamSchema = new Schema({
  teamName: {
    type: String,
    trim: true,
    unique: true,
    default: '',
    required: 'A team name is required',
    validate: [validateLocalStrategyProperty, 'Please fill in your team name']
  },
  memberIds: {
    /* Array of _ids of team members */
    type: [Schema.ObjectId]
  },
  ownerId: {
    required: true,
    type: Schema.ObjectId
  },
  lookingForMembers: {
    type: Boolean,
    default: true
  },
  approved: {
    /* Team names must be approved by Kyle */
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    default: '',
    validate: [validateLocalStrategyPassword, 'Password must be at least 8 characters']
  },
  salt: {
    type: String
  },
  updated: {
    type: Date
  },
  created: {
    type: Date,
    default: Date.now
  }
});

/**
 * Hook a pre save method to hash the password
 */
PuzzleHuntTeamSchema.pre('save', function(next) {

  if (!this.skipHash && this.password && this.password.length >= 8) {
    this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
    this.password = this.hashPassword(this.password);
  }

  next();
});

/**
 * Create instance method for hashing a password
 */
PuzzleHuntTeamSchema.methods.hashPassword = function(password) {
  if (this.salt && password) {
    return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
  } else {
    return password;
  }
};

/**
 * Create instance method for authenticating with a team
 */
PuzzleHuntTeamSchema.methods.authenticate = function(password) {
  return this.password === this.hashPassword(password);
};

mongoose.model('PuzzleHuntTeam', PuzzleHuntTeamSchema);
