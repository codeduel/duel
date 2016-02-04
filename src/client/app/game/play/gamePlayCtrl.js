angular.module('duel.game.playCtrl', ['duel.game.playFact', 'ui.ace',])

.controller('GamePlayCtrl', ['$scope', '$state', '$stateParams', 'GamePlayFact', 'UserFact', function($scope, $state, $stateParams, GamePlayFact, UserFact) {

  angular.extend($scope, GamePlayFact);

  $scope.gameId = $stateParams.gameId;
  $scope.userName = UserFact.getUser().userName;
  $scope.data = {};
  $scope.data.solution = $scope.client.initial;

  $scope.counter = "0 minutes";

  //updates solution textarea when initial code is loaded
  $scope.$watch('client.initial', function(newVal, oldVal){
    $scope.data.solution = $scope.client.initial;
  }, true);

  $scope.$watch('client.minutes', function(newVal, oldVal){
    if(newVal === 1){
      $scope.counter = $scope.client.minutes + " minute"
    }
    else{
      $scope.counter = $scope.client.minutes + " minutes"
    }
  }, true);

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
  };

  $scope.aceLoaded = function (_editor) {
    _editor.blockScrolling = Infinity;
    console.log("ace editor loaded");
};





}]);
