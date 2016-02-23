// Server routes back here after authenticating with GitHub
angular.module('duel.authCtrl', [])

.controller('AuthCtrl', ['$scope', '$stateParams', '$state', 'UserFact', '$window', function($scope, $stateParams, $state, UserFact, $window) {
  var userName = $stateParams.userName;
  var userId = $stateParams.userId;
  UserFact.setUserName(userName);
  //TODO ENABLE ONCE CHAT ETC HAS BEEN REFACTORED - see UserFact for details
  //UserFact.setUserId(userId);

  $state.go('wrap.lobby');
  analytics.page('Lobby');

}]);
