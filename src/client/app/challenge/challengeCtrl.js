angular.module('duel.challengeCtrl', ['duel.challengeFact'])

.controller('ChallengeCtrl', ['$scope', '$state', '$stateParams', 'ChallengeFact', function($scope, $state, $stateParams, ChallengeFact) {

  $scope.gameid = $stateParams.gameid;
  $scope.data = {}

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
