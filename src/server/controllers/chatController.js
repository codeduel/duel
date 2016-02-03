//Imports the sendTo function from socketRoutes
var sendTo = require('../api/socketRoutes.js').sendTo;

//********************
//SOngCKET CONTROLLERS
//********************

/*
 *  Sends a message to all sockets in a room
 */
exports.message = function(msg, socket) {
  var room = msg.data.room;
  var text = msg.data.text;
  var userId = msg.data.userId;
  sendTo(room, 'chat/message', {
    userId: userId,
    socketId: socket.id,
    text: text
  });
}