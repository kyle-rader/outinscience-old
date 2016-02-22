'use strict';

/**
 * User schema for WWU Puzzle Hunt
 * @author Noah Strong <strongn@wwu.edu>
 */

var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  crypto = require('crypto');

/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function(property) {
  return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * A Validation function for local strategy password
 */
var validateLocalStrategyPassword = function(password) {
  return (this.provider !== 'local' || (password && password.length >= 8));
};

var PuzzleHuntUserSchema = new Schema({
  firstName: {
    type: String,
    trim: true,
    default: '',
    required: 'A first name is required',
    validate: [validateLocalStrategyProperty, 'Please fill in your first name']
  },
  lastName: {
    type: String,
    trim: true,
    default: '',
    required: 'A last name is required',
    validate: [validateLocalStrategyProperty, 'Please fill in your last name']
  },
  displayName: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    default: '',
    required: 'An email is required',
    validate: [validateLocalStrategyProperty, 'Please fill in your email'],
    match: [/.+\@.+\..+/, 'Please fill a valid email address']
  },
  phone: {
    type: String,
    default: '',
    match: [/[0-9]{10}/, 'Phone number must be 10 digits']
  },
  password: {
    type: String,
    default: '',
    validate: [validateLocalStrategyPassword, 'Password must be at least 8 characters']
  },
  major: {
    /* Field of study */
    type: String,
    default: '',
    trim: true
  },
  teamId: {
    /* _id of team that this user is a member of, if any */
    type: Schema.ObjectId,
    default: null
  },
  wantsTshirt: {
    type: Boolean,
    default: false
  },
  tShirtSize: {
    type: String,
    default: null,
    trim: true
  },
  privacy: {
    email: {
      type: String,
      trim: true,
      default: 'private'
    },
    phone: {
      type: String,
      trim: true,
      default: 'private'
    }
  },
  role: {
    type: String,
    enum: ['player', 'helper', 'admin'],
    default: 'player'
  },
  userType: {
    type: String,
    enum: ['outInScienceUser', 'puzzleHuntUser'],
    required: true,
    trim: true
  },
  salt: {
    type: String
  },
  updated: {
    type: Date
  },
  verified: {
    type: Boolean,
    default: false
  },
  created: {
    type: Date,
    default: Date.now
  },
  /* For reset password */
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  },
  confirmEmailToken: {
    type: String
  },
  confirmEmailExpires: {
    type: String
  },
  revertEmailToken: {
    type: String
  },
  oldEmail: {
    type: String
  }
});

/**
 * Hook a pre save method to check for email already in use
 */
PuzzleHuntUserSchema.pre('save', function(next) {

  this.constructor.findOne({
    email: this.email,
    _id: { '$ne' : this._id }
  }, function(err, user) {
    if (!err && user) {
      next(new mongoose.Error('email-in-use'));
    } else {
      next();
    }
  });
});

/**
 * Hook a pre save method to hash the password
 */
PuzzleHuntUserSchema.pre('save', function(next) {

  if (!this.skipHash && this.password && this.password.length >= 8) {
    this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
    this.password = this.hashPassword(this.password);
  }

  next();
});

/**
 * Create instance method for hashing a password
 */
PuzzleHuntUserSchema.methods.hashPassword = function(password) {
  if (this.salt && password) {
    return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
  } else {
    return password;
  }
};

/**
 * Create instance method for authenticating user
 */
PuzzleHuntUserSchema.methods.authenticate = function(password) {
  return this.password === this.hashPassword(password);
};

mongoose.model('PuzzleHuntUser', PuzzleHuntUserSchema);
