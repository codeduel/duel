angular.module('duel.challengeFact', ['duel.socketFact'])

.factory('ChallengeFact', ['SocketFact', function(SocketFact) {

  SocketFact.socket.on('challenge/gameStart', function(data){
    console.log(data);
  });  

  var connectToGame = function(connectionData) {
    var msg = SocketFact.buildMessage(connectionData);
    SocketFact.socket.emit('challenge/ready', msg);
  }

  return {
    connectToGame: connectToGame
  }

}]);
