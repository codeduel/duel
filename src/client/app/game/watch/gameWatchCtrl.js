angular.module('duel.game.watchCtrl', ['duel.game.watchFact', 'duel.chatFact', 'duel.userFact'])

.controller('GameWatchCtrl', ['$stateParams', '$scope', 'GameWatchFact', 'ChatFact', 'UserFact', function($stateParams, $scope, GameWatchFact, ChatFact, UserFact) {
  $scope.gameId = $stateParams.gameId;
  
  GameWatchFact.reset();
  ChatFact.joinRoom(UserFact.getUser().userName, $scope.gameId + '/watch');
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
}]);
