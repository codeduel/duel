angular.module('duel.challengeCtrl', ['duel.challengeFact'])

.controller('ChallengeCtrl', ['$scope', '$state', '$stateParams', 'ChallengeFact', function($scope, $state, $stateParams, ChallengeFact) {
  $scope.currentUser = $stateParams.userid;
  $scope.gameid = $stateParams.gameid;
  $scope.data = {}
  $scope.question = ChallengeFact.client.question;
  $scope.getQuestion = ChallengeFact.getQuestion;
  $scope.winner = ChallengeFact.endGame();
  if(!$scope.winner === false){
    alert($scope.winner() + ' won the challenge!')
    $state.go('lobby', {
      userid: $scope.userid
    });
  }
  //Calls ChallengeFact's connectToGame() once the user enters the 'challenge' state
  ChallengeFact.connectToGame({
    userid: window.localStorage.getItem('duel.userid'),
    gameid: $scope.gameid
  });

  $scope.submitSolution = function() {
    ChallengeFact.submitSolution({
      userid: window.localStorage.getItem('duel.userid'),
      gameid: $scope.gameid,
      solution: $scope.data.solution
    })
  }

}]);
