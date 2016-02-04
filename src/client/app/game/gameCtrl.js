angular.module('duel.gameCtrl', ['duel.game.playCtrl', 'duel.game.watchCtrl'])

.controller('GameCtrl', ['$scope', '$state', '$stateParams', 'UserFact', function($scope, $state, $stateParams, UserFact) {
  $scope.gameId = $stateParams.gameId;
  $scope.currentUser = UserFact.getUser().userName;
  $scope.data = {};
  $scope.data.PIN = '';
  
  $scope.play = function() {
    $state.go('game.play', {
      gameId: $scope.gameId
    })
  }

  $scope.watch = function() {
    $state.go('game.watch', {
      gameId: $scope.gameId
    })
  }
}]);
