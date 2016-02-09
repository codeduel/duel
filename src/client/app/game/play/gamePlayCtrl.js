angular.module('duel.game.playCtrl', [])

.controller('GamePlayCtrl', ['$location', '$scope', '$state', '$stateParams', 'GamePlayFact', 'UserFact', 'ChatFact', function($location, $scope, $state, $stateParams, GamePlayFact, UserFact, ChatFact) {
  GamePlayFact.reset();

  $scope.client = GamePlayFact.client;
  $scope.gameId = $stateParams.gameId;
  $scope.userName = UserFact.getUser().userName;
  $scope.data = {};
  $scope.data.solution = $scope.client.initial;
  $scope.data.numSpectators = 0;
  $scope.data.output = GamePlayFact.output;
  $scope.data.won = GamePlayFact.won;
  $scope.data.currView = 'question';

  //Generates a shareable link
  var link = '<a>' + $location.absUrl() + '</a>';
  ChatFact.add({
    userId: 'SYSTEM',
    text: 'Welcome to Code Duel! You can invite your friends to spectate with you with this link: ' + link + '!',
    bold: true
  });

  //buffer time (in ms) between typing before streaming the data to spectators
  $scope.DEBOUNCE_INTERVAL = 100;

  $scope.stream = function() {
    GamePlayFact.stream({
      code: $scope.data.solution,
      gameId: $scope.gameId,
      userId: UserFact.getUser().userName
    });
  };

  $scope.toggleView = function(view) {
    $scope.data.currView = view;
  };

  $scope.counter = '0 minutes';

  //updates solution textarea when initial code is loaded
  $scope.$watch('client.initial', function(newVal, oldVal) {
    if (newVal !== oldVal) {
      $scope.data.solution = $scope.client.initial;
      $scope.stream();
    }
  }, true);

  $scope.$watch('client.minutes', function(newVal, oldVal) {
    if (newVal !== oldVal) {
      if (newVal === 1) {
        $scope.counter = $scope.client.minutes + ' minute';
      } else {
        $scope.counter = $scope.client.minutes + ' minutes';
      }
    }
  }, true);


  $scope.$watch(function() {
    return GamePlayFact.spectators;
  }, function(newVal, oldVal) {
    if (newVal !== oldVal) {
      $scope.data.numSpectators = Object.keys(newVal).length;
    }
  }, true);

  $scope.$watch(function() {
    return GamePlayFact.output;
  }, function(newVal, oldVal) {
    if (newVal !== oldVal) {
      $scope.data.output = newVal;
    }
  }, true);

  $scope.$watch(function() {
    return GamePlayFact.won;
  }, function(newVal, oldVal) {
    if (newVal !== oldVal) {
      $scope.data.won = newVal;
    }
  }, true);

  //Calls GamePlayFact's connectToGame() once the user enters the 'game' state
  GamePlayFact.connectToGame({
    userId: UserFact.getUser().userId,
    gameId: $scope.gameId
  });

  //Starts an initial stream to spectators
  $scope.stream();

  $scope.submitSolution = function() {
    GamePlayFact.submitSolution({
      userId: UserFact.getUser().userId,
      gameId: $scope.gameId,
      solution: $scope.data.solution
    });
    analytics.track('Submitted Solution', {
      userName: $scope.userName,
      gameId: $scope.gameId,
      counter: $scope.counter
    });
  };

  $scope.toLobby = function() {
    $state.go('lobby');
  };

  analytics.track('Entered Game', {
    userName: $scope.userName,
    gameId: $scope.gameId
  });

  $scope.spectate = function() {
    $state.go('game.watch', {
      gameId: $scope.gameId
    });
  };
}]);
