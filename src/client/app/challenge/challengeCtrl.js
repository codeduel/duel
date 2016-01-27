angular.module('duel.challengeCtrl', ['duel.challengeFact'])

.controller('ChallengeCtrl', ['$scope', '$state', '$stateParams', 'ChallengeFact', function($scope, $state, $stateParams, ChallengeFact) {
  $scope.currentUser = $stateParams.userId;
  $scope.gameId = $stateParams.gameId;
  $scope.data = {}

  $scope.getMessage = ChallengeFact.getMessage;
  $scope.getQuestion = ChallengeFact.getQuestion;
  $scope.getInitial = ChallengeFact.getInitial;
  $scope.getWinner = ChallengeFact.getWinner;
  
  if($scope.getWinner() !== null){
    console.log("if statement working");
    // alert($scope.winner + ' won the challenge!')
    // $state.go('lobby', {
    //   userId: $scope.userId
    // });
  }
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
    })
  }

}]);
