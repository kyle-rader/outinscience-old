'use strict';

/**
 * Team Invite schema for WWU Puzzle Hunt
 * @author Kyle Rader <kyle@kylerader.ninja>
 */

var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  crypto = require('crypto');


var PuzzleHuntInviteSchema = new Schema({
  teamId: {
    // The Team inviting a member
    required: true,
    type: Schema.ObjectId
  },
  email: {
    // The email invited
    required: true,
    type: Schema.ObjectId
  },
  accepted: {
    type: Boolean,
    default: false
  },
  acceptedOn: {
    type: Date,
    default: null
  },
  created: {
    type: Date,
    default: Date.now
  }
});


mongoose.model('PuzzleHuntInvite', PuzzleHuntInviteSchema);
