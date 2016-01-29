angular.module('duel.loginCtrl', [])

.controller('LoginCtrl', ['$scope', '$state', '$window', 'UserFact', function($scope, $state, $window, UserFact) {
  $scope.submitForm = function() {
    //TODO: change this for auth
    UserFact.setUserName($scope.userName);
    $state.go('lobby');
  };
}]);
