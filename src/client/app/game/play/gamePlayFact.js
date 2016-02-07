angular.module('duel.game.playFact', [])

.factory('GamePlayFact', ['UserFact', 'SocketFact', '$rootScope', '$timeout', '$interval', '$state', function(UserFact, SocketFact, $rootScope, $timeout, $interval, $state) {
  var gamePlayFact = {};

  gamePlayFact.reset = function() {
    gamePlayFact.client = {
      question: "question will be displayed when challenge commences",
      message: "Waiting for opponent...",
      initial: "Your Code Here",
      winner: null,
      minutes: 0,
    };
    var lastStreamedCode = '';

    gamePlayFact.spectators = {};
    gamePlayFact.output = '';
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
    gamePlayFact.output = '<h3>Output:</h3>';
    gamePlayFact.output += '<div class="reason">' + data.reason + '</div>';
    for (var i = 0; i < data.output.length; i++) {
      gamePlayFact.output += data.output[i];
    }
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
    var msg = SocketFact.buildMessage({
      code: lastStreamedCode,
      to: data.to,
      userId: UserFact.getUser().userId
    });
    SocketFact.socket.emit('watch/stream', msg);
  });

  SocketFact.socket.on('game/updateSpectators', function(data) {
    gamePlayFact.spectators = data;
    $rootScope.$apply();
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
