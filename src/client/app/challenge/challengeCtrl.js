angular.module('duel.challengeCtrl', [])

.controller('ChallengeCtrl', ['$scope', '$state', '$stateParams', function($scope, $state, $stateParams) {

$scope.gameid = $stateParams.gameid;

}]);