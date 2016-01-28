var Game = require('./gameModel.js').Game;

//builds Game object to return to client
module.exports.buildGameObj = function(gameModel) {
  var clientGame = {};
  clientGame.gameId = gameModel.gameId;
  clientGame.players = gameModel.players;
  clientGame.active = gameModel.active;
  clientGame.spectators = gameModel.spectators;
  clientGame.question = gameModel.question;
  clientGame.initialCode = gameModel.initialCode;
  return clientGame;
};
