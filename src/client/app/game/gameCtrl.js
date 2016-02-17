angular.module('duel.gameCtrl', [])

.controller('GameCtrl', ['$scope', '$state', '$stateParams', 'UserFact', '$http', function($scope, $state, $stateParams, UserFact, $http) {
  $scope.gameId = $stateParams.gameId;
  $scope.currentUser = UserFact.getUser().userName;
  $scope.data = {};

  $http({
    url: '/api/game/verify',
    method: 'GET',
    params: {
      gameId: $scope.gameId
    }
  }).then(function(response) {
    if (!response.data.found) {
      alert('Game does not exist!');
      $state.go('wrap.lobby');
    }
  }, function(err) {
    throw err;
  });

  $scope.play = function() {
    $http.post('/api/game/unlock', {
      gameId: $scope.gameId,
      password: $scope.data.password
    }).then(function(response) {
      if (response.data.err) {
        alert('Incorrect password!');
      } else {
        $state.go('wrap.game.play', {
          gameId: $scope.gameId
        });
      }
    });
  };

  $scope.watch = function() {
    $state.go('wrap.game.watch', {
      gameId: $scope.gameId
    });

    //leaving this on the client (for now) as anonymous users can be spectators
    analytics.track('Joined to Watch', {
      userName: $scope.currentUser,
      gameId: $scope.gameId
    });

  };

}]);
