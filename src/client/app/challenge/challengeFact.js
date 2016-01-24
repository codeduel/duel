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

  challengeFact.submitSolution = function(solutionData) {
    var msg = SocketFact.buildMessage(solutionData);
    SocketFact.socket.emit('challenge/submit', msg);
  }

  return challengeFact;

}]);
