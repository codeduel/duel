angular.module('duel.challengeFact', ['duel.socketFact'])

.factory('ChallengeFact', ['SocketFact', function(SocketFact) {
  var challengeFact = {};

  SocketFact.socket.on('challenge/gameStart', function(data){
    console.log(data);
  });  

  challengeFact.connectToGame = function(connectionData) {
    var msg = SocketFact.buildMessage(connectionData);
    SocketFact.socket.emit('challenge/ready', msg);
  }

  return challengeFact;

}]);
