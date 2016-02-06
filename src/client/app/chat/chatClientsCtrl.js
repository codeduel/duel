angular.module('duel.chat.clientsCtrl', [])

.controller('ChatClientsCtrl', ['SocketFact', '$scope', 'ChatFact', function(SocketFact, $scope, ChatFact) {
  $scope.data = {};
  $scope.data.connectedClients = ChatFact.clients;
  $scope.data.numClients = 0;
  $scope.data.numGuests = 0;

  $scope.$watch(function() {
    return ChatFact.clients;
  }, function(newVal, oldVal) {
    $scope.data.connectedClients = ChatFact.clients;
    var clients = Object.keys(ChatFact.clients);
    $scope.data.numClients = clients.length;
    var count = 0;
    for (var client in ChatFact.clients) {
      if (!ChatFact.clients[client]) {
        count++;
      }
    }
    $scope.data.numGuests = count;
  }, true);

}]);
