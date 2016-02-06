angular.module('duel.game.playFact', ['duel.socketFact', 'duel.userFact'])

.factory('GamePlayFact', ['UserFact', 'SocketFact', '$rootScope', '$timeout', '$interval', '$state', function(UserFact, SocketFact, $rootScope, $timeout, $interval, $state) {
  var gamePlayFact = {};

  gamePlayFact.reset = function(){
    gamePlayFact.client = {
      question: "question will be displayed when challenge commences",
      message: "Waiting for opponent...",
      initial: "Your Code Here",
      winner: null,
      minutes: 0
    };

    var lastStreamedCode = '';
  };

  gamePlayFact.reset();

  //****************
  //Socket Listeners
  //****************

  SocketFact.socket.on('game/start', function(data) {
    //updates message, question, and initial code once game starts
    gamePlayFact.client.message = "The challenge has begun";
    gamePlayFact.client.question = data.question;
    gamePlayFact.client.initial = data.initialCode;
    $interval(function() {
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
    $timeout(function() {
      $state.go('lobby', {
        //must be refactored with sessions
        //userid: $scope.userid
      });
    }, 3000)
  });

  SocketFact.socket.on('game/streamTo', function(data) {
    console.log('hit');
    var msg = SocketFact.buildMessage({
      code: lastStreamedCode,
      to: data.to,
      userId: UserFact.getUser().userId
    });
    SocketFact.socket.emit('watch/stream', msg);
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
    lastStreamedCode = editorData.code;
    var msg = SocketFact.buildMessage(editorData);
    SocketFact.socket.emit('watch/stream', msg);
  }

  return gamePlayFact;
}]);
