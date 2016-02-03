angular.module('duel.lobby.usersCtrl', ['duel.chatFact', 'luegg.directives'])

.controller('LobbyUsersCtrl', ['$scope', 'ChatFact', function($scope, ChatFact) {
  $scope.data = {};
  $scope.data.connectedClients = ChatFact.currRoom;
  $scope.data.numClients = 0;

  $scope.$watch(function() {
    return ChatFact.currRoom;
  }, function(newVal, oldVal) {
    $scope.data.connectedClients = ChatFact.currRoom;
    $scope.data.numClients = Object.keys(ChatFact.currRoom).length;
  }, true);

}]);
