// Server routes back here after authenticating with GitHub
angular.module('duel.authCtrl', [])

.controller('AuthCtrl', ['$scope', '$stateParams', '$state', 'UserFact', '$window', function($scope, $stateParams, $state, UserFact, $window) {
  var userName = $stateParams.userName;
  var userId = $stateParams.userId;
  UserFact.setUserName(userName);
  $window.localStorage.setItem('duel.userName', userName);
  $window.localStorage.setItem('duel.userId', userId);

  analytics.identify(userId, {
    name: userName,
    method: 'oAuth'
  });

  $state.go('lobby')

}]);
