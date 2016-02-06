var io = null;

var controllers = {};

module.exports.init = function(newIo) {
  console.log('Socket Server initialized.');
  io = newIo;
  /*
   *  Controllers
   *
   *  var featureController = require('./featureController.js');
   */
  controllers = {
    gameController: require('../controllers/gameController.js'),
    chatController: require('../controllers/chatController.js'),
    spectatorController: require('../controllers/spectatorController.js')
  };

  listeners();

};

var listeners = function() {
  if (!io) {
    return;
  }

  io.on('connection', function(socket) {
    socket.duelData = {};
    socket.duelData.subscribedRooms = [];
    /*
     *  Game events
     */
    socket.on('game/ready', function(data) {
      controllers.gameController.playerJoin(data, socket);
    });

    socket.on('game/submit', function(data) {
      controllers.gameController.submitSolution(data, socket);
    });

    /*
     *  Streaming/spectator events
     */
    socket.on('watch/init', function(data) {
      controllers.spectatorController.init(data, socket);
    });

    socket.on('watch/stream', function(data) {
      controllers.spectatorController.stream(data, socket);
    });

    /*
     *  Chat events
     */
    socket.on('chat/join', function(data) {
      controllers.chatController.join(data, socket);
    });

    socket.on('chat/message', function(data) {
      controllers.chatController.message(data, socket);
    });

    socket.on('chat/leave', function(data) {
      console.log(data);
      controllers.chatController.leave(data, socket);
    });

    //disconnect event for games and chat
    socket.on('disconnect', function() {
      controllers.gameController.playerLeave(socket);
      controllers.chatController.leaveAll(socket);
    });
  });
};

module.exports.sendTo = function(to, event, data) {
  if (!io) {
    return;
  }
  io.to(to).emit(event, data);
};

/* Used for handling socket errors
errorType - is an optional short string that allows for special handling on the client (request new id etc)
errorData - is optional error data that gets sent to error handling functions on the client.
if there is no error handling function, a generic function is used that displays an error message and clear the application data
errorData.userErrorMessage gets displayed to user by generic error handler
Example:
  errorType: 'playerJoin'
  errorData: {
    userErrorMessage: 'Unfortunately we couldn\'t start your game!'
  }
*/
module.exports.socketError = function(to, errorType, errorData) {
  if (!io) {
    return;
  }
  data = {
    errorType: errorType,
    errorData: errorData
  };
  io.to(to).emit('serverSocketError', data);
};
