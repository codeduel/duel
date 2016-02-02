angular.module('duel.challengeCtrl', ['duel.challengeFact', 'ui.ace',])

.controller('ChallengeCtrl', ['$scope', '$state', '$stateParams', 'ChallengeFact', 'UserFact', function($scope, $state, $stateParams, ChallengeFact, UserFact) {

  angular.extend($scope, ChallengeFact);

  $scope.gameId = $stateParams.gameId;
  $scope.currentUser = UserFact.getUser().userName || $stateParams.userName;
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

  //Calls ChallengeFact's connectToGame() once the user enters the 'challenge' state
  ChallengeFact.connectToGame({
    userId: window.localStorage.getItem('duel.userId'),
    gameId: $scope.gameId
  });

  $scope.submitSolution = function() {
    ChallengeFact.submitSolution({
      userId: window.localStorage.getItem('duel.userId'),
      gameId: $scope.gameId,
      solution: $scope.data.solution
    });
  };

  $scope.aceLoaded = function (_editor) {
    _editor.blockScrolling = Infinity;
    console.log("ace editor loaded");
};





}]);
