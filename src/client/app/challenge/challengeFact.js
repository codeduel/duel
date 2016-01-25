angular.module('duel.challengeFact', ['duel.socketFact'])

.factory('ChallengeFact', ['SocketFact', '$rootScope', function(SocketFact, $rootScope) {
  var challengeFact = {};
  challengeFact.client = {
    question: "question loading..."
  };
  challengeFact.getQuestion = function(){
    return challengeFact.client.question;
  }
  //****************
  //Socket Listeners
  //****************

  SocketFact.socket.on('challenge/gameStart', function(data) {
    console.log("Game has begun", data);
    //console.log(data.question)
    challengeFact.client.question = data.question;
    $rootScope.$apply();
  });

  SocketFact.socket.on('challenge/invalidSolution', function(data) {
    console.log('Invalid solution!');
    console.log(data);
  })

  SocketFact.socket.on('challenge/winner', function(data) {
    console.log(data.winner + ' won the challenge!');
  })


  //***************
  //Socket Triggers
  //***************

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
