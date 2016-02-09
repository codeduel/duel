angular.module('duel.lobbyCtrl', [])

.controller('LobbyCtrl', ['$scope', '$state', 'LobbyFact', 'UserFact', function($scope, $state, LobbyFact, UserFact, ChatFact) {

  $scope.userName = UserFact.getUser().userName;
  $scope.currentView = null;
  $scope.data = {};
  $scope.data.activeGames = LobbyFact.activeGames;

  $scope.$watch(function() {
    return LobbyFact.activeGames;
  }, function(newVal, oldVal) {
    if (newVal !== oldVal) {
      $scope.data.activeGames = LobbyFact.activeGames;
    }
  });

  $scope.join = function() {
    $state.go('wrap.game', {
      gameId: $scope.data.gameId
    });
    analytics.track('Joined Game', {
      userName: $scope.userName,
      gameId: $scope.data.gameId
    });
  };

  $scope.create = function() {
    LobbyFact.createGame($scope.data.difficulty, $scope.data.password, $scope.userName)
      .then(function(response) {
        $state.go('wrap.game.play', {
          gameId: response.data.gameId
        });
      });
  };

  analytics.page('Lobby', {
    title: 'Lobby',
    path: '/lobby'
  });

  $scope.back = function() {
    $scope.currentView = null;
  };

  $scope.jumpTo = function(gameId) {
    $state.go('wrap.game', {
      gameId: gameId
    });
  };
}]);
