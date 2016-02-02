angular.module('duel.lobbyGamesCtrl', ['duel.lobbyGamesFact'])

.controller('LobbyGamesCtrl', ['$scope', '$state', 'LobbyGamesFact', 'UserFact', function($scope, $state, LobbyGamesFact, UserFact, ChatFact) {

  $scope.currentView = false;
  $scope.data = {};

  $scope.join = function() {
    $state.go('challenge', {
      gameId: $scope.data.gameId
    });
  };

  $scope.create = function() {
    LobbyGamesFact.createGame($scope.data.difficulty)
      .then(function(response) {
        $state.go('challenge', {
          gameId: response.data.gameId,
          userId: $scope.currentUser
        });
      });
  };

}]);
