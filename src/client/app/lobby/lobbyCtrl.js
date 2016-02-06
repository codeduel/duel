angular.module('duel.lobbyCtrl', [])

.controller('LobbyCtrl', ['$scope', '$state', 'LobbyFact', 'UserFact', function($scope, $state, LobbyFact, UserFact, ChatFact) {

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
    LobbyFact.createGame($scope.data.difficulty, $scope.data.password)
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
