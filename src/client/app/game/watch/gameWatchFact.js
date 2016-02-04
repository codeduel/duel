angular.module('duel.game.watchFact', ['duel.socketFact'])

.factory('GameWatchFact', ['$rootScope', 'SocketFact', '$state', function($rootScope, SocketFact, $state) {
  var gameWatchFact = {};

  gameWatchFact.watchedClients = {};

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

  return gameWatchFact;
}]);
