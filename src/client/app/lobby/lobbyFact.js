angular.module('duel.lobbyFact', [])

.factory('LobbyFact', ['$http', function($http) {
   var lobbyFact = {};

  /*
   *  Creates a game on the server, and returns an object with the created game's ID
   */
  lobbyFact.createGame = function(difficulty) {
    return $http.post('/api/game/create', {
        difficulty: difficulty
      })
      .then(function(response) {
        return response;
      }, function(err) {
        throw err;
      });
  };

  return lobbyFact;
}]);
