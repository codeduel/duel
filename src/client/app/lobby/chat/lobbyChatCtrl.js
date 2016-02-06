angular.module('duel.lobby.chatCtrl', ['duel.chatFact', 'luegg.directives'])

.controller('LobbyChatCtrl', ['$scope', 'ChatFact', 'UserFact', function($scope, ChatFact, UserFact) {
  $scope.data = {};
  $scope.data.messages = ChatFact.messages;
  $scope.data.chatInput = '';

  $scope.sendMessage = function() {
    if ($scope.data.chatInput.trim()) {
      ChatFact.sendMessage($scope.data.chatInput, 'lobby');
      $scope.data.chatInput = '';
    }
    analytics.track('Sent Chat', {
      userName: UserFact.getUser().userName,
      channel: 'lobby'
    });
  }

  //converts a string to a unique color hex code
  $scope.nameToColor = function(str) {
    return ChatFact.nameToColor(str);
  };
}]);
