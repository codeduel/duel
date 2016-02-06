angular.module('duel.game.watchCtrl', [])

.controller('GameWatchCtrl', ['$state', '$stateParams', '$scope', 'GameWatchFact', 'ChatFact', 'UserFact', function($state, $stateParams, $scope, GameWatchFact, ChatFact, UserFact) {
  $scope.gameId = $stateParams.gameId;

  GameWatchFact.reset();
  GameWatchFact.init($scope.gameId);

  $scope.playerCode = GameWatchFact.playerCode;
  $scope.players = GameWatchFact.players;
  $scope.numPlayers = 0;

  $scope.$watch(function() {
    return GameWatchFact.playerCode;
  }, function(newVal, oldVal) {
    $scope.playerCode = GameWatchFact.playerCode;
  }, true);

  $scope.$watch(function() {
    return GameWatchFact.players;
  }, function(newVal, oldVal) {
    if (newVal !== oldVal) {
      var arr = [];
      for(var socketId in newVal) {
        arr.push(newVal[socketId]);
      }
      $scope.players = arr;
      $scope.numPlayers = $scope.players.length;
    }
  }, true);

  $scope.aceLoaded = function(_editor) {
    _editor.blockScrolling = Infinity;
  };

  $scope.toLobby = function() {
    $state.go('lobby');
  }
}]);
