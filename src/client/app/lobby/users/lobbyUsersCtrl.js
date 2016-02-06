angular.module('duel.lobby.usersCtrl', ['duel.chatFact', 'luegg.directives'])

.controller('LobbyUsersCtrl', ['$scope', 'ChatFact', function($scope, ChatFact) {
  $scope.data = {};
  $scope.data.connectedClients = ChatFact.currRoom;
  $scope.data.numClients = 0;
  $scope.data.numGuests = 0;

  $scope.$watch(function() {
    return ChatFact.currRoom;
  }, function(newVal, oldVal) {
    $scope.data.connectedClients = ChatFact.currRoom;
    var clients = Object.keys(ChatFact.currRoom);
    $scope.data.numClients = clients.length;
    var count = 0;
    for(var client in ChatFact.currRoom) {
      if(!ChatFact.currRoom[client]) {
        count++;
      }
    }
    $scope.data.numGuests = count;
  }, true);

}]);
