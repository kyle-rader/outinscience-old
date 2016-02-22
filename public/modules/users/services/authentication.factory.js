'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
  function() {
    var _this = this;

    var user = null;
    if (window.user && window.user._id && window.user.userType === 'outInScienceUser') {
      user = window.user;
    }
    _this._data = {
      user: user
    };

    return _this._data;
  }
]);
