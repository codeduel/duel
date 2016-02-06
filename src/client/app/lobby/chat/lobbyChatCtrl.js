angular.module('duel.lobby.chatCtrl', ['duel.chatFact', 'luegg.directives'])

.controller('LobbyChatCtrl', ['$scope', 'ChatFact', 'UserFact', function($scope, ChatFact, UserFact) {
  $scope.data = {};
  $scope.data.messages = ChatFact.messages;
  $scope.data.chatInput = '';

  $scope.sendMessage = function() {
    if ($scope.data.chatInput.trim()) {
      ChatFact.sendMessage(UserFact.getUser().userName, $scope.data.chatInput, 'lobby');
      $scope.data.chatInput = '';
    }
    analytics.track('Sent Chat', {
      userName: UserFact.getUser().userName,
      channel: 'lobby'
    });
  }

  //converts a string to a unique color hex code
  $scope.nameToColor = function(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = (hash << 5) + hash + str.charCodeAt(i);
      hash = hash & hash;
      hash = Math.abs(hash);
    }
    var hex = '#' + (hash % 16777215).toString(16);
    return hex;
  };
}]);
