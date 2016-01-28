angular.module('duel.challengeCtrl', ['duel.challengeFact'])

.controller('ChallengeCtrl', ['$scope', '$state', '$stateParams', 'ChallengeFact', function($scope, $state, $stateParams, ChallengeFact) {
  angular.extend($scope, ChallengeFact);
  
  $scope.currentUser = $stateParams.userid;
  $scope.gameid = $stateParams.gameid;
  $scope.data = {};
  $scope.data.solution = $scope.client.initial;
  
  //updates solution textarea when initial code is loaded
  $scope.$watch('client.initial', function(newVal, oldVal){
    $scope.data.solution = $scope.client.initial;
  }, true);

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
