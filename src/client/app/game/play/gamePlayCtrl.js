angular.module('duel.game.playCtrl', ['duel.game.playFact', 'ui.ace', 'duel.chatFact'])

.controller('GamePlayCtrl', ['$scope', '$state', '$stateParams', 'GamePlayFact', 'UserFact', 'ChatFact', function($scope, $state, $stateParams, GamePlayFact, UserFact, ChatFact) {
  GamePlayFact.reset();
  
  $scope.client = GamePlayFact.client;
  $scope.gameId = $stateParams.gameId;
  $scope.userName = UserFact.getUser().userName;
  $scope.data = {};
  $scope.data.solution = $scope.client.initial;

  //buffer time (in ms) between typing before streaming the data to spectators
  $scope.DEBOUNCE_INTERVAL = 100;

  $scope.stream = function() {
    GamePlayFact.stream({
      code: $scope.data.solution,
      gameId: $scope.gameId,
      userId: UserFact.getUser().userName
    })
  }

  $scope.counter = "0 minutes";

  //updates solution textarea when initial code is loaded
  $scope.$watch('client.initial', function(newVal, oldVal) {
    if(newVal !== oldVal) {
      $scope.data.solution = $scope.client.initial;
      $scope.stream();
    }
  }, true);

  $scope.$watch('client.minutes', function(newVal, oldVal) {
    if (newVal === 1) {
      $scope.counter = $scope.client.minutes + " minute"
    } else {
      $scope.counter = $scope.client.minutes + " minutes"
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
      userId: UserFact.getUser().userId,
      gameId: $scope.gameId
    });
  };

  $scope.toLobby = function() {
    $state.go('lobby');
  }
}]);
