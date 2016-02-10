angular.module('duel.game.watchCtrl', [])

.controller('GameWatchCtrl', ['$location', '$state', '$stateParams', '$scope', 'GameWatchFact', 'ChatFact', 'UserFact', function($location, $state, $stateParams, $scope, GameWatchFact, ChatFact, UserFact) {
  $scope.gameId = $stateParams.gameId;

  GameWatchFact.reset();
  GameWatchFact.init($scope.gameId);

  $scope.data = {
    players: GameWatchFact.players,
    numPlayers: 0,
    question: GameWatchFact.question
  };

  //Generates a shareable link
  var link = '<a>' + $location.absUrl() + '</a>';
  ChatFact.add({
    userId: 'SYSTEM',
    text: 'Welcome to Code Duel! You can invite your friends to spectate with you with this link: ' + link + '!',
    bold: true
  });


  $scope.playerCode = GameWatchFact.playerCode;

  $scope.$watch(function() {
    return GameWatchFact.question;
  }, function(newVal, oldVal) {
    $scope.data.question = GameWatchFact.question;
  }, true);

  $scope.$watch(function() {
    return GameWatchFact.playerCode;
  }, function(newVal, oldVal) {
    $scope.playerCode = GameWatchFact.playerCode;
  }, true);

  $scope.$watch(function() {
    return GameWatchFact.players;
  }, function(newVal, oldVal) {
    if (newVal !== oldVal) {
      var arr = [];
      for (var socketId in newVal) {
        arr.push(newVal[socketId]);
      }
      $scope.data.players = arr;
      $scope.data.numPlayers = $scope.data.players.length;
    }
  }, true);

  $scope.aceLoaded = function(_editor) {
    _editor.blockScrolling = Infinity;
  };

  $scope.toLobby = function() {
    $state.go('wrap.lobby');
  };
}]);
