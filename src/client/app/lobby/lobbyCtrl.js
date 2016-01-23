angular.module('duel.lobbyCtrl', ['duel.lobbyFact'])

.controller('LobbyCtrl', ['$scope', '$state', '$stateParams', 'LobbyFact', function($scope, $state, $stateParams, LobbyFact) {

  $scope.currentUser = $stateParams.userid;
  $scope.currentView = false;
  $scope.data = {};

  $scope.join = function() {
    $state.go('challenge', {
      gameid: $scope.data.gameid
    });
  }

  $scope.create = function() {
    LobbyFact.createGame($scope.data.difficulty)
      .then(function(response) {
        $state.go('challenge', {
          gameid: response.data.gameid
        });
      })
  }

}]);
