angular.module('duel.challengeCtrl', ['duel.challengeFact'])

.controller('ChallengeCtrl', ['$scope', '$state', '$stateParams', 'ChallengeFact', 'UserFact', function($scope, $state, $stateParams, ChallengeFact, UserFact) {

  angular.extend($scope, ChallengeFact);

  $scope.gameId = $stateParams.gameId;
  $scope.currentUser = UserFact.getUser().userName;
  $scope.data = {};
  $scope.data.solution = $scope.client.initial;

  //updates solution textarea when initial code is loaded
  $scope.$watch('client.initial', function(newVal, oldVal){
    $scope.data.solution = $scope.client.initial;
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

}]);
