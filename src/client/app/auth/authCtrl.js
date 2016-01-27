// Server routes back here after authenticating with GitHub
angular.module('duel.authCtrl', ['ui.router'])

.controller('AuthCtrl', ['$scope', '$stateParams', '$state', 'User',  function ($scope, $stateParams, $state, User){

  var userId = $stateParams.userId;
 
  User.login(userId)
      .then(function() {
      $state.go('lobby', {
      userId: $scope.userId
      });
    });
}]);