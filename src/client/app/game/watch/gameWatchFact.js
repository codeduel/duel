angular.module('duel.game.watchFact', ['duel.socketFact'])

.factory('GameWatchFact', ['$rootScope', 'SocketFact', '$state', function($rootScope, SocketFact, $state) {
  var gameWatchFact = {};

  gameWatchFact.reset = function() {
    gameWatchFact.watchedClients = {};
  }
  
  gameWatchFact.reset();
  
  //****************
  //Socket Listeners
  //****************
  SocketFact.socket.on('watch/update', function(data) {
    gameWatchFact.watchedClients[data.userId] = data.code;
    $rootScope.$apply();
  });

  SocketFact.socket.on('watch/winner', function(data) {
    alert(data.winner + ' won the game!');
    $state.go('lobby');
  });

  //***************
  //Socket Triggers
  //***************
  gameWatchFact.init = function(gameId) {
    var msg = SocketFact.buildMessage({
      gameId: gameId
    });
    SocketFact.socket.emit('watch/init', msg);
  }

  return gameWatchFact;
}]);
