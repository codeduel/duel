angular.module('duel.loginCtrl', [])

.controller('LoginCtrl', ['$scope', '$state', '$window', 'UserFact', function($scope, $state, $window, UserFact) {
  $scope.submitForm = function() {
    //TODO: change this for auth
    UserFact.setUserName($scope.userName);

    //TODO update userName from first line with userId when available
    analytics.identify( $scope.userName {
      name: $scope.userName,
      method: 'submitForm'
    });

    $state.go('lobby');
  };
}]);
