angular.module('duel.game.playFact', [])

.factory('GamePlayFact', ['ChatFact', 'UserFact', 'SocketFact', '$rootScope', '$timeout', '$interval', '$state', function(ChatFact, UserFact, SocketFact, $rootScope, $timeout, $interval, $state) {
  var gamePlayFact = {};
  var userName = UserFact.getUser().userName;

  gamePlayFact.reset = function() {
    gamePlayFact.client = {
      question: 'question will be displayed when challenge commences',
      message: 'Waiting for opponent...',
      initial: 'Your Code Here',
      winner: null,
      minutes: 0,
    };
    var lastStreamedCode = '';

    gamePlayFact.spectators = {};
    gamePlayFact.output = '';
    gamePlayFact.won = false;
  };

  gamePlayFact.reset();

  //****************
  //Socket Listeners
  //****************

  SocketFact.socket.on('game/start', function(data) {
    //updates message, question, and initial code once game starts
    gamePlayFact.client.message = 'The challenge has begun';
    gamePlayFact.client.question = data.question;
    gamePlayFact.client.initial = data.initialCode;

    $interval(function() {
        gamePlayFact.client.minutes++;
      }, 60000);
      //should refactor to not use rootScope?
    $rootScope.$apply();
  });

  SocketFact.socket.on('game/results', function(data) {
    var output;
    if (data.valid) {
      ChatFact.add({
        userId: 'SYSTEM',
        text: 'Congrats, you won! You can leave the game or watch the other players code!',
        bold: true
      });
      gamePlayFact.won = true;
      output = '<h3>You win!</h3>';
    } else {
      output = '<h3>Error:</h3>' + '<pre>' + data.reason + '</pre>';
    }
    for (var i = 0; i < data.output.length; i++) {
      output += data.output[i];
    }
    gamePlayFact.output = output;
    $rootScope.$apply();
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
  };

  gamePlayFact.submitSolution = function(solutionData) {
    var msg = SocketFact.buildMessage(solutionData);
    SocketFact.socket.emit('game/submit', msg);
  };

  gamePlayFact.stream = function(editorData) {
    lastStreamedCode = editorData.code;
    var msg = SocketFact.buildMessage(editorData);
    SocketFact.socket.emit('watch/stream', msg);
  };

  return gamePlayFact;
}]);
