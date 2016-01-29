angular.module('duel.lobbyCtrl', ['duel.lobbyFact'])

.controller('LobbyCtrl', ['$scope', '$state', 'LobbyFact', 'UserFact', function($scope, $state, LobbyFact, UserFact) {

  $scope.currentUser = UserFact.getUser().userName;
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
