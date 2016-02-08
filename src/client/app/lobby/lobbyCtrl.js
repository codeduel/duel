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
    $state.go('game', {
      gameId: $scope.data.gameId
    });
    analytics.track('Joined Game', {
      userName: $scope.userName,
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
      userName: $scope.userName,
      currentView: $scope.currentView,
      difficulty: $scope.data.difficulty
    });
  };

  analytics.page('Lobby', {
    title: 'Lobby',
    url: 'http://www.codeduel.io/#/lobby',
    path: '/lobby'
  });

  $scope.back = function() {
    $scope.currentView = null;
  };

  $scope.jumpTo = function(gameId) {
    $state.go('game', {
      gameId: gameId
    });
  }
}]);
