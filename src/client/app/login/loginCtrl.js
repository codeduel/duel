angular.module('duel.loginCtrl', [])

.controller('LoginCtrl', ['$scope', '$state', function($scope, $state) {
  $scope.submitForm = function() {
    $state.go('lobby', {
      userid: $scope.userid
    });
  }
}]);