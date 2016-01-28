angular.module('duel.loginCtrl', [])

.controller('LoginCtrl', ['$scope', '$state', function($scope, $state) {
  $scope.submitForm = function() {
    //TODO: change this for auth
    window.localStorage.setItem('duel.userId', $scope.userId);

    $state.go('lobby', {
      userId: $scope.userId
    });
  }
}]);
