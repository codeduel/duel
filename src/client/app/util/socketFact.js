angular.module('duel.socketFact', [])

.factory('SocketFact', [function() {
  var socketFact = {};

  socketFact.socket = io();

  socketFact.buildMessage = function(data) {
    //TODO: add additional data/tokens to the data
    return {
      data: data
    };
  }

  socketFact.socket.on('test', function(data) {
    console.log(data);
  })
  
  return socketFact;
}]);
