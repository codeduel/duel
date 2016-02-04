angular.module('duel.lobby.gamesCtrl', ['duel.lobby.gamesFact'])

.controller('LobbyGamesCtrl', ['$scope', '$state', 'LobbyGamesFact', 'UserFact', function($scope, $state, LobbyGamesFact, UserFact, ChatFact) {

  $scope.currentView = null;
  $scope.data = {};

  $scope.join = function() {
    $state.go('game', {
      gameId: $scope.data.gameId
    });
    analytics.track('Joined Game', {
      currentView: $scope.currentView,
      gameId: $scope.data.gameId
    });
  };

  $scope.create = function() {
    LobbyGamesFact.createGame($scope.data.difficulty, $scope.data.password)
      .then(function(response) {
        $state.go('game.play', {
          gameId: response.data.gameId
        });
      });
      analytics.track('Created Game', {
        currentView: $scope.currentView,
        difficulty: $scope.data.difficulty
      });
  };

  $scope.back = function() {
    $scope.currentView = null;
  };
}]);
