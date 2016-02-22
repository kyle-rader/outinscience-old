'use strict';

angular.module('the-out-list').controller('TheOutListController', ['$scope', 'Authentication', '$http',
  function($scope, Authentication, $http) {
    $scope.user = Authentication.user;

    $http.get('/outlist')
      .success(function(data, status, headers, config) {
        $scope.outlist = data;
      });
  }
]).directive('outlistEntry', function() {
  return {
    restrict: 'E',
    scope: {
      user:'=user'
    },
    replace: true,
    templateUrl: '/modules/the-out-list/views/templates/outlist-entry.client.view.template.html'
  };
}).directive('primaryTags', function() {
  return {
    restrict: 'E',
    scope: {
      tags: '=tags'
    },
    replace: true,
    templateUrl: '/modules/the-out-list/views/templates/tags.client.view.template.html'
  };
});
