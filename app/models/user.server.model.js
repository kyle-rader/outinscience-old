'use strict';

/**
 * Module dependencies.
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

/**
 * User Schema
 */
var UserSchema = new Schema({
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
	pronouns: {
		type: String,
		trim: true,
		default: ''
	},
	orientation: {
		type: String,
		default: '',
		trim: true,
	},
	bio: {
		type: String,
		trim: true,
		default: ''
	},
	password: {
		type: String,
		default: '',
		validate: [function(val) { return val && val.length >= 8; }, 'Password must be at least 8 characters']
	},
	primaryTags: {
		biology: {
			type: Boolean,
			default: false
		},
		astronomy: {
			type: Boolean,
			default: false
		},
		vehicleDesign: {
			type: Boolean,
			default: false
		},
		scienceEducation: {
			type: Boolean,
			default: false
		},
		plasticsComposites: {
			type: Boolean,
			default: false
		},
		physics: {
			type: Boolean,
			default: false
		},
		neuroscience: {
			type: Boolean,
			default: false
		},
		math: {
			type: Boolean,
			default: false
		},
		materialScience: {
			type: Boolean,
			default: false
		},
		manufacturingEngineering: {
			type: Boolean,
			default: false
		},
		industrialDesign: {
			type: Boolean,
			default: false
		},
		environmentalScience: {
			type: Boolean,
			default: false
		},
		electricalEngineering: {
			type: Boolean,
			default: false
		},
		computerScience: {
			type: Boolean,
			default: false
		},
		chemistry: {
			type: Boolean,
			default: false
		},
		geology: {
			type: Boolean,
			default: false
		}
	},
	secondaryTags: {
		biology: {
			type: Boolean,
			default: false
		},
		astronomy: {
			type: Boolean,
			default: false
		},
		vehicleDesign: {
			type: Boolean,
			default: false
		},
		scienceEducation: {
			type: Boolean,
			default: false
		},
		plasticsComposites: {
			type: Boolean,
			default: false
		},
		physics: {
			type: Boolean,
			default: false
		},
		neuroscience: {
			type: Boolean,
			default: false
		},
		math: {
			type: Boolean,
			default: false
		},
		materialScience: {
			type: Boolean,
			default: false
		},
		manufacturingEngineering: {
			type: Boolean,
			default: false
		},
		industrialDesign: {
			type: Boolean,
			default: false
		},
		environmentalScience: {
			type: Boolean,
			default: false
		},
		electricalEngineering: {
			type: Boolean,
			default: false
		},
		computerScience: {
			type: Boolean,
			default: false
		},
		chemistry: {
			type: Boolean,
			default: false
		},
		geology: {
			type: Boolean,
			default: false
		}
	},
	privacy: {
		firstName: {
			type: String,
			trim: true,
			default: 'private'
		},
		lastName: {
			type: String,
			trim: true,
			default: 'private'
		},
		email: {
			type: String,
			trim: true,
			default: 'private'
		},
		phone: {
			type: String,
			trim: true,
			default: 'private'
		},
		pronouns: {
			type: String,
			trim: true,
			default: 'private'
		},
		orientation: {
			type: String,
			trim: true,
			default: 'private'
		},
		bio: {
			type: String,
			trim: true,
			default: 'private'
		},
		primaryTags: {
			type: String,
			trim: true,
			default: 'private'
		},
		secondaryTags: {
			type: String,
			trim: true,
			default: 'private'
		},
		otherTags: {
			type: String,
			trim: true,
			default: 'private'
		}
	},
	salt: {
		type: String
	},
	provider: {
		type: String,
		required: 'Provider is required'
	},
	providerData: {},
	additionalProvidersData: {},
	roles: {
		type: [{
			type: String,
			enum: ['user', 'admin']
		}],
		default: ['user']
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
	}
});

/**
 * Hook a pre save method to check for email already in use
 */
UserSchema.pre('save', function(next) {

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
UserSchema.pre('save', function(next) {

	if (!this.skipHash && this.password && this.password.length > 8) {
		this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
		this.password = this.hashPassword(this.password);
	}

	next();
});

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function(password) {
	if (this.salt && password) {
		return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
	} else {
		return password;
	}
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function(password) {
	return this.password === this.hashPassword(password);
};

/**
 * Find possible not used username
 */
UserSchema.statics.findUniqueUsername = function(username, suffix, callback) {
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

mongoose.model('User', UserSchema);
