angular.module('duel.lobby.gamesFact', [])

.factory('LobbyGamesFact', ['$http', function($http) {
   var lobbyFact = {};

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

  return lobbyFact;
}]);