angular.module('duel.lobby.gamesCtrl', ['duel.lobby.gamesFact'])

.controller('LobbyGamesCtrl', ['$scope', '$state', 'LobbyGamesFact', 'UserFact', function($scope, $state, LobbyGamesFact, UserFact, ChatFact) {

  $scope.currentView = false;
  $scope.data = {};

  $scope.join = function() {
    $state.go('game', {
      gameId: $scope.data.gameId
    });
  };

  $scope.create = function() {
    LobbyGamesFact.createGame($scope.data.difficulty)
      .then(function(response) {
        $state.go('game', {
          gameId: response.data.gameId
        });
      });
  };

}]);
