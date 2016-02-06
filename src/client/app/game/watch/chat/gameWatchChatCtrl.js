angular.module('duel.game.watch.chatCtrl', ['duel.chatFact', 'luegg.directives'])

.controller('GameWatchChatCtrl', ['$scope', 'ChatFact', 'UserFact', function($scope, ChatFact, UserFact) {
  $scope.data = {};
  $scope.data.messages = ChatFact.messages;
  $scope.data.chatInput = '';

  $scope.sendMessage = function() {
    if ($scope.data.chatInput.trim()) {
      ChatFact.sendMessage($scope.data.chatInput, $scope.$parent.gameId + '/watch');
      $scope.data.chatInput = '';
    }
  }

  //converts a string to a unique color hex code
  $scope.nameToColor = function(str) {
    return ChatFact.nameToColor(str);
  };
}]);
