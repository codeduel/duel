angular.module('duel.lobbyCtrl', ['duel.lobbyFact'])

.controller('LobbyCtrl', ['$scope', '$state', '$stateParams', 'LobbyFact', function($scope, $state, $stateParams, LobbyFact) {

  $scope.currentUser = $stateParams.userId;
  $scope.currentView = false;
  $scope.data = {};


  $scope.join = function() {
    $state.go('challenge', {
      gameId: $scope.data.gameId,
      userId: $scope.currentUser
    });
  }

  $scope.create = function() {
    LobbyFact.createGame($scope.data.difficulty)
      .then(function(response) {
        $state.go('challenge', {
          gameId: response.data.gameId,
          userId: $scope.currentUser
        });
      })
  }

}]);
