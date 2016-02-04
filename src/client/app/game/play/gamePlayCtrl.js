angular.module('duel.game.playCtrl', ['duel.game.playFact', 'ui.ace', 'duel.chatFact'])

.controller('GamePlayCtrl', ['$scope', '$state', '$stateParams', 'GamePlayFact', 'UserFact', 'ChatFact', function($scope, $state, $stateParams, GamePlayFact, UserFact, ChatFact) {

  $scope.client = GamePlayFact.client;
  $scope.gameId = $stateParams.gameId;
  $scope.userName = UserFact.getUser().userName;
  $scope.data = {};
  $scope.data.solution = $scope.client.initial;

  //buffer time (in ms) between typing before streaming the data to spectators
  $scope.DEBOUNCE_INTERVAL = 500;

  $scope.counter = "0 minutes";

  //updates solution textarea when initial code is loaded
  $scope.$watch('client.initial', function(newVal, oldVal) {
    $scope.data.solution = $scope.client.initial;
  }, true);

  $scope.$watch('client.minutes', function(newVal, oldVal) {
    if (newVal === 1) {
      $scope.counter = $scope.client.minutes + " minute"
    } else {
      $scope.counter = $scope.client.minutes + " minutes"
    }
  }, true);

  //Maps the socket client to the game room
  ChatFact.joinRoom(UserFact.getUser().userName, $scope.gameId);

  //Calls GamePlayFact's connectToGame() once the user enters the 'game' state
  GamePlayFact.connectToGame({
    userId: UserFact.getUser().userId,
    gameId: $scope.gameId
  });


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

  $scope.aceLoaded = function(_editor) {
    _editor.blockScrolling = Infinity;
  };

  $scope.stream = function() {
    GamePlayFact.stream({
      code: $scope.data.solution,
      gameId: $scope.gameId,
      userId: UserFact.getUser().userName
    })
  }
}]);
