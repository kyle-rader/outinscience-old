'use strict';

// Authentication service for user variables
angular.module('puzzle-hunt').factory('PuzzleAuth', [
  function() {
    var _this = this;

    var user = null;
    if (window.user && window.user._id && window.user.userType === 'puzzleHuntUser') {
      user = window.user;
    }
    _this._data = {
      user: user
    };

    return _this._data;
  }
]);
