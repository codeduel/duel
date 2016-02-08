angular.module('duel.lobbyFact', [])

.factory('LobbyFact', ['$rootScope', 'SocketFact', '$http', function($rootScope, SocketFact, $http) {
  var lobbyFact = {};

  lobbyFact.activeGames = {};

  /*
   *  Creates a game on the server, and returns an object with the created game's ID
   */
  lobbyFact.createGame = function(difficulty, password) {
    return $http.post('/api/game/create', {
        difficulty: difficulty,
        password: password
      })
      .then(function(response) {
        return response;
      }, function(err) {
        throw err;
      });
  };

  /*
   *  Socket listener for updates on the list of active games
   */
  SocketFact.socket.on('lobby/activeGames', function(data) {
    lobbyFact.activeGames = data;
    $rootScope.$apply();
  })

  return lobbyFact;
}])

//custom filter to order object by properties
.filter('orderObjectBy', function() {
  return function(obj, prop) {
    var arr = [];
    for (var key in obj) {
      arr.push(obj[key]);
    }
    arr.sort(function(a, b) {
      return b[prop] - a[prop];
    });
    return arr;
  }
});
