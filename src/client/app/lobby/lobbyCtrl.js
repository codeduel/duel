angular.module('duel.lobbyCtrl', [])

.controller('LobbyCtrl', ['$scope', '$state', 'LobbyFact', 'UserFact', 'ChatFact' , function($scope, $state, LobbyFact, UserFact, ChatFact) {

  var errors = {
    'difficulty': 'You must choose a valid difficulty!',
    'user': 'You must <a href="/#/login">login</a> in order to create a game!'
  };

  $scope.userName = UserFact.getUser().userName;
  $scope.currentView = 'games';
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
        if (response.data.gameId) {
          $state.go('wrap.game.play', {
            gameId: response.data.gameId
          });
        } else {
          ChatFact.add({
            userId: 'SYSTEM',
            text: errors[response.data.err],
            bold: true
          });
        }
      });
  };

  analytics.page('Lobby', {
    title: 'Lobby',
    path: '/lobby'
  });

  $scope.toggleView = function(view) {
    $scope.currentView = view;
  };

  $scope.jumpTo = function(gameId) {
    $state.go('wrap.game', {
      gameId: gameId
    });
  };
}]);
