angular.module('duel.challengeFact', ['duel.socketFact'])

.factory('ChallengeFact', ['SocketFact', '$rootScope', '$timeout','$interval','$state', function(SocketFact, $rootScope, $timeout, $interval, $state) {
  var challengeFact = {};
  challengeFact.client = {
    question: "question will be displayed when challenge commences",
    message: "Waiting for opponent...",
    initial: "Your Code Here",
    winner: null,
    minutes: 0
  };

  //****************
  //Socket Listeners
  //****************

  SocketFact.socket.on('challenge/gameStart', function(data) {
    console.log("Game has begun", data);
    //updates message, question, and initial code once game starts
    challengeFact.client.message = "The challenge has begun";
    challengeFact.client.question = data.question;
    challengeFact.client.initial = data.initialCode;
    $interval(function(){
      challengeFact.client.minutes++;
    }, 60000)
    //should refactor to not use rootScope?
    $rootScope.$apply();
  });

  SocketFact.socket.on('challenge/invalidSolution', function(data) {
    console.log('Invalid solution!', data);
    challengeFact.client.message = "Your solution was invalid.  Please try again.";
    $rootScope.$apply();
  })

  SocketFact.socket.on('challenge/winner', function(data) {
    //console.log(data.winner + ' won the challenge!');
    challengeFact.client.winner = data.winner;
    challengeFact.client.message = data.winner + ' won the challenge!  Taking you back to the lobby...';
    //should refactor to not use rootScope?
    $rootScope.$apply();

    //reroutes to Lobby 3 seconds after a someone wins
    $timeout(function(){
      $state.go('lobby', {
        //must be refactored with sessions
        //userid: $scope.userid
      });
    }, 3000)
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
