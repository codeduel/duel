// Server routes back here after authenticating with GitHub
angular.module('duel.authCtrl', ['ui.router'])

.controller('AuthCtrl', ['$scope', '$stateParams', '$state', 'UserFact', '$window', function($scope, $stateParams, $state, UserFact, $window) {
  var userName = $stateParams.userID;
  UserFact.setUserName(userName);
  $window.localStorage.setItem('duel.userName', userName);

  $state.go('lobby')
}]);
