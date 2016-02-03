angular.module('duel.loginCtrl', [])

.controller('LoginCtrl', ['$scope', '$state', '$window', 'UserFact', function($scope, $state, $window, UserFact) {
  $scope.submitForm = function() {
    //TODO: change this for auth
    UserFact.setUserName($scope.userName);

    //TODO update with database userId when available
    analytics.identify({
      name: $scope.userName,
      method: 'submitForm'
    });

    $state.go('lobby');
  };
}]);
