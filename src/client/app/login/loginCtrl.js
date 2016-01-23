angular.module('duel.loginCtrl', [])

.controller('LoginCtrl', ['$scope', '$state', function($scope, $state) {
  $scope.submitForm = function() {
    //TODO: change this for auth
    window.localStorage.setItem('duel.userid', $scope.userid);

    $state.go('lobby', {
      userid: $scope.userid
    });
  }
}]);