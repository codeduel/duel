angular.module('duel.game.watchFact', ['duel.socketFact'])

.factory('GameWatchFact', ['$rootScope', 'SocketFact', function($rootScope, SocketFact) {
  var gameWatchFact = {};

  gameWatchFact.watchedClients = {};

  //****************
  //Socket Listeners
  //****************
  SocketFact.socket.on('watch/update', function(data) {
    gameWatchFact.watchedClients[data.userId] = data.code;
    $rootScope.$apply();
  });

  return gameWatchFact;
}]);
