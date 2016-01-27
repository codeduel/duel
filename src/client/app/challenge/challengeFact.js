angular.module('duel.challengeFact', ['duel.socketFact'])

.factory('ChallengeFact', ['SocketFact', '$rootScope', function(SocketFact, $rootScope) {
  var challengeFact = {};
  challengeFact.client = {
    question: "question loading...",
    winner: false
  };
  challengeFact.getQuestion = function(){
    return challengeFact.client.question;
  }
  challengeFact.endGame = function(){
    return challengeFact.client.winner;
  }
  //****************
  //Socket Listeners
  //****************

  SocketFact.socket.on('challenge/gameStart', function(data) {
    console.log("Game has begun", data);
    challengeFact.client.question = data.question;
    //should refactor to not use rootScope?
    $rootScope.$apply();
  });

  SocketFact.socket.on('challenge/invalidSolution', function(data) {
    console.log('Invalid solution!');
    console.log(data);
  })

  SocketFact.socket.on('challenge/winner', function(data) {
    console.log(data.winner + ' won the challenge!');
    challengeFact.client.winner = data.winner;
    //should refactor to not use rootScope?
    $rootScope.$apply();
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
