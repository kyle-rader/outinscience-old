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
	return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * A Validation function for local strategy password
 */
var validateLocalStrategyPassword = function(password) {
	return (this.provider !== 'local' || (password && password.length >= 8));
};

var PuzzleHuntUserSchema = new Schema({
	teamName: {
		type: String,
		trim: true,
		unique: true,
		default: '',
		required: 'A team name is required',
		validate: [validateLocalStrategyProperty, 'Please fill in your team name']
	},
	members: {
		/* Array of _ids of team members */
		type: [Schema.ObjectId]
	},
	owner_id: {
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
	verified: {
		type: Boolean,
		default: false
	},
	created: {
		type: Date,
		default: Date.now
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

	if (!this.skipHash && this.password && this.password.length > 8) {
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

/**
 * Find possible not used username
 */
PuzzleHuntUserSchema.statics.findUniqueUsername = function(username, suffix, callback) {
	var _this = this;
	var possibleUsername = username + (suffix || '');

	_this.findOne({
		username: possibleUsername
	}, function(err, user) {
		if (!err) {
			if (!user) {
				callback(possibleUsername);
			} else {
				return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
			}
		} else {
			callback(null);
		}
	});
};

mongoose.model('PuzzleHuntTeam', PuzzleHuntUserSchema);
