angular.module('duel.game.watchCtrl', [])

.controller('GameWatchCtrl', ['$state', '$stateParams', '$scope', 'GameWatchFact', 'ChatFact', 'UserFact', function($state, $stateParams, $scope, GameWatchFact, ChatFact, UserFact) {
  $scope.gameId = $stateParams.gameId;
  
  GameWatchFact.reset();
  GameWatchFact.init($scope.gameId);

  $scope.watchedClients = GameWatchFact.watchedClients;

  $scope.$watch(function() {
    return GameWatchFact.watchedClients;
  }, function(newVal, oldVal) {
    $scope.watchedClients = GameWatchFact.watchedClients;
  }, true);

  $scope.aceLoaded = function(_editor) {
    _editor.blockScrolling = Infinity;
  };

  $scope.toLobby = function() {
    $state.go('lobby');
  }
}]);
