//Imports the sendTo function from socketRoutes
var sendTo = require('../api/socketRoutes.js').sendTo;
//Imports the socketError function from socketRoutes
var socketError = require('../api/socketRoutes.js').socketError;
//Imports the game model
var Game = require('../models/gameModel.js').Game;

//Sends the player's editor code to either all spectators or a single spectator
exports.stream = function(msg, socket) {
  var to = msg.data.to || msg.data.gameId + '/watch';
  sendTo(to, 'watch/update', {
    userId: msg.data.userId,
    code: msg.data.code
  });
};

//Initalizes a spectator connection and retrieves the inital stream from each player
exports.init = function(msg, socket) {
  sendTo(msg.data.gameId, 'game/streamTo', {
    to: socket.id
  });
  Game.findOne({
    gameId: msg.data.gameId
  }, function(error, foundGame) {
    if (foundGame.active) {
      sendTo(msg.data.gameId + '/watch', 'watch/prompt', {
        question: foundGame.question
      });
    }
  });
};
