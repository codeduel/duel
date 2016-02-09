angular.module('duel.game.watchFact', [])

.factory('GameWatchFact', ['$rootScope', 'SocketFact', '$state', function($rootScope, SocketFact, $state) {
  var gameWatchFact = {};

  gameWatchFact.reset = function() {
    gameWatchFact.playerCode = {};
    gameWatchFact.players = {};
  };

  gameWatchFact.reset();

  //****************
  //Socket Listeners
  //****************
  SocketFact.socket.on('watch/update', function(data) {
    gameWatchFact.playerCode[data.userId] = data.code;
    $rootScope.$apply();
  });

  SocketFact.socket.on('game/updatePlayers', function(data) {
    gameWatchFact.players = data;
    $rootScope.$apply();
  });

  //***************
  //Socket Triggers
  //***************
  gameWatchFact.init = function(gameId) {
    var msg = SocketFact.buildMessage({
      gameId: gameId
    });
    SocketFact.socket.emit('watch/init', msg);
  };

  return gameWatchFact;
}]);
