angular.module('duel.challengeFact', ['duel.socketFact'])

.factory('ChallengeFact', ['SocketFact', '$rootScope', function(SocketFact, $rootScope) {
  var challengeFact = {};
  challengeFact.client = {
    question: "question will be displayed when challenge commences",
    message: "Waiting for opponent...",
    initial: "Your Code Here",
    winner: null
  };
  challengeFact.getQuestion = function(){
    return challengeFact.client.question;
  }
  challengeFact.getMessage = function(){
    return challengeFact.client.message;
  }
   challengeFact.getInitial = function(){
    return challengeFact.client.initial;
  }
  challengeFact.getWinner = function(){
    console.log("getting winner: " + challengeFact.client.winner)
    return challengeFact.client.winner;
  }
  //****************
  //Socket Listeners
  //****************

  SocketFact.socket.on('challenge/gameStart', function(data) {
    console.log("Game has begun", data);
    challengeFact.client.message = "The challenge has begun";
    challengeFact.client.question = data.question;
    challengeFact.client.initial = data.initialCode;
    //should refactor to not use rootScope?
    $rootScope.$apply();
  });

  SocketFact.socket.on('challenge/invalidSolution', function(data) {
    console.log('Invalid solution!', data);
    challengeFact.client.message = "Your solution was invalid.  Please try again.";
    $rootScope.$apply();
  })

  SocketFact.socket.on('challenge/winner', function(data) {
    console.log(data.winner + ' won the challenge!');
    challengeFact.client.winner = data.winner;
    challengeFact.client.message = data.winner + ' won the challenge!  Taking you back to the lobby...';
    //should refactor to not use rootScope?
    challengeFact.getWinner();
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
