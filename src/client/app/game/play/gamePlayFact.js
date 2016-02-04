angular.module('duel.game.playFact', ['duel.socketFact'])

.factory('GamePlayFact', ['SocketFact', '$rootScope', '$timeout','$interval','$state', function(SocketFact, $rootScope, $timeout, $interval, $state) {
  var gamePlayFact = {};
  gamePlayFact.client = {
    question: "question will be displayed when challenge commences",
    message: "Waiting for opponent...",
    initial: "Your Code Here",
    winner: null,
    minutes: 0
  };

  //****************
  //Socket Listeners
  //****************

  SocketFact.socket.on('game/start', function(data) {
    console.log("Game has begun", data);
    //updates message, question, and initial code once game starts
    gamePlayFact.client.message = "The challenge has begun";
    gamePlayFact.client.question = data.question;
    gamePlayFact.client.initial = data.initialCode;
    $interval(function(){
      gamePlayFact.client.minutes++;
    }, 60000)
    //should refactor to not use rootScope?
    $rootScope.$apply();
  });

  SocketFact.socket.on('game/invalidSolution', function(data) {
    console.log('Invalid solution!', data);
    gamePlayFact.client.message = "Your solution was invalid.  Please try again.";
    $rootScope.$apply();
  });

  SocketFact.socket.on('game/winner', function(data) {
    //console.log(data.winner + ' won the challenge!');
    gamePlayFact.client.winner = data.winner;
    gamePlayFact.client.message = data.winner + ' won the challenge!  Taking you back to the lobby...';
    //should refactor to not use rootScope?
    $rootScope.$apply();

    //reroutes to Lobby 3 seconds after a someone wins
    $timeout(function(){
      $state.go('lobby', {
        //must be refactored with sessions
        //userid: $scope.userid
      });
    }, 3000)
  });

  //***************
  //Socket Triggers
  //***************

  gamePlayFact.connectToGame = function(connectionData) {
    var msg = SocketFact.buildMessage(connectionData);
    SocketFact.socket.emit('game/ready', msg);
  }

  gamePlayFact.submitSolution = function(solutionData) {
    var msg = SocketFact.buildMessage(solutionData);
    SocketFact.socket.emit('game/submit', msg);
  }

  gamePlayFact.stream = function(editorData) {
    var msg = SocketFact.buildMessage(editorData);
    SocketFact.socket.emit('watch/stream', msg);
  }

  return gamePlayFact;
}]);
