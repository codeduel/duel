angular.module('duel.lobbyChatCtrl', ['duel.chatFact', 'luegg.directives'])

.controller('LobbyChatCtrl', ['$scope', 'ChatFact', 'UserFact', function($scope, ChatFact, UserFact) {
  $scope.data = {};
  $scope.data.messages = ChatFact.messages;
  $scope.data.chatInput = '';

  ChatFact.joinRoom(UserFact.getUser().userName, 'lobby');

  $scope.sendMessage = function() {
    if ($scope.data.chatInput.trim()) {
      ChatFact.sendMessage(UserFact.getUser().userName, $scope.data.chatInput, 'lobby');
    $scope.data.chatInput = '';
    }
  }
}]);
