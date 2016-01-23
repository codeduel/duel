angular.module('duel.lobbyCtrl', [])

.controller('LobbyCtrl', ['$scope', '$state', '$stateParams', function($scope, $state, $stateParams) {

  $scope.currentUser = $stateParams.userid;
  $scope.currentView = false;
  $scope.data = {}

  $scope.join = function() {
    $state.go('challenge', {
      gameid: $scope.data.gameid
    });
  }
}]);
