angular.module('duel.lobbyCtrl', ['duel.lobbyFact'])

.controller('LobbyCtrl', ['$scope', '$state', '$stateParams', 'LobbyFact', 'UserFact', function($scope, $state, $stateParams, LobbyFact, UserFact) {

console.log($stateParams.userName);

  $scope.currentUser = UserFact.getUser().userName || $stateParams.userName;
  $scope.currentView = false;
  $scope.data = {};


  $scope.join = function() {
    $state.go('challenge', {
      gameId: $scope.data.gameId
    });
  };

  $scope.create = function() {
    LobbyFact.createGame($scope.data.difficulty)
      .then(function(response) {
        $state.go('challenge', {
          gameId: response.data.gameId,
          userId: $scope.currentUser
        });
      });
  };

}]);
