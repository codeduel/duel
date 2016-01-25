/*
 *  Controllers
 *
 *  var featureController = require('./featureController.js');
 */

var gameController = require('../controllers/gameController.js');

var io = null;

module.exports.init = function(newIo) {
  console.log('Socket Server initialized.')
  io = newIo;
  listeners();
}

var listeners = function() {
  if (!io) {
    return;
  }
  console.log('Socket listeners created.');

  io.on('connection', function(socket) {
    socket.on('register', function(data) {});

    /*
     *  Challenge events
     */
    socket.on('challenge/ready', function(data) {
      gameController.playerJoin(data, socket);
    });

    socket.on('challenge/submit', function(data) {
      gameController.submitSolution(data, socket);
    })

    socket.on('disconnect', function() {});
  });
};

module.exports.sendTo = function(to, event, data) {
  if (!io) {
    return;
  }
  io.to(to).emit(event, data);
};
