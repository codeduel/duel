angular.module('duel.challengeCtrl', ['duel.challengeFact'])

.controller('ChallengeCtrl', ['$scope', '$state', '$stateParams', 'ChallengeFact', function($scope, $state, $stateParams, ChallengeFact) {
  $scope.currentUser = $stateParams.userid;
  $scope.gameid = $stateParams.gameid;
  $scope.data = {}

  $scope.getMessage = ChallengeFact.getMessage;
  $scope.getQuestion = ChallengeFact.getQuestion;
  $scope.getInitial = ChallengeFact.getInitial;
  $scope.getWinner = ChallengeFact.getWinner;
  
  if($scope.getWinner() !== null){
    console.log("if statement working");
    // alert($scope.winner + ' won the challenge!')
    // $state.go('lobby', {
    //   userid: $scope.userid
    // });
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
