angular.module('duel.gameCtrl', [])

.controller('GameCtrl', ['$scope', '$state', '$stateParams', 'UserFact', '$http', function($scope, $state, $stateParams, UserFact, $http) {
  $scope.gameId = $stateParams.gameId;
  $scope.currentUser = UserFact.getUser().userName;
  $scope.data = {};

  $scope.play = function() {
    $http.post('/api/game/unlock', {
      gameId: $scope.gameId,
      password: $scope.data.password
    }).then(function(response) {
      if (response.status === 200) {
        $state.go('wrap.game.play', {
          gameId: $scope.gameId
        });
        analytics.track('Joined to Play', {
          userName: $scope.currentUser,
          gameId: $scope.gameId
        });
      }
    });
  };

  $scope.watch = function() {
    $state.go('wrap.game.watch', {
      gameId: $scope.gameId
    });
    analytics.track('Joined to Watch', {
      userName: $scope.currentUser,
      gameId: $scope.gameId
    });
  };

}]);
