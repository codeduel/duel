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
    clientsController: require('../controllers/clientsController.js')
  };

  listeners();

};

var listeners = function() {
  if (!io) {
    return;
  }
  console.log('Socket listeners created.');

  io.on('connection', function(socket) {
    socket.subscribedRooms = [];

    /*
     *  Challenge events
     */
    socket.on('challenge/ready', function(data) {
      controllers.gameController.playerJoin(data, socket);
    });

    socket.on('challenge/submit', function(data) {
      controllers.gameController.submitSolution(data, socket);
    });

    /*
     *  Chat events
     */
    socket.on('chat/join', function(data) {
      controllers.clientsController.join(data, socket);
    });

    socket.on('chat/message', function(data) {
      controllers.chatController.message(data, socket);
    });

    socket.on('disconnect', function() {
      controllers.clientsController.leaveAll(socket);
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
