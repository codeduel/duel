//Imports the sendTo function from socketRoutes
var sendTo = require('../api/socketRoutes.js').sendTo;

//Imports the client connections model
var clientConnections = require('../models/clientConnectionsModel.js');

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

/*
 *  Adds the client socket to a room
 */
exports.join = function(msg, socket) {
  var room = msg.data.room;
  var userId = msg.data.userId;
  console.log(userId + ' joined ' + room);
  clientConnections.add(room, socket.id, userId);

  socket.duelData.subscribedRooms.push(room);
  socket.join(room);
  sendTo(room, 'chat/update', clientConnections.getClients(room));
}

/*
 *  Removes the client socket from all rooms
 */
exports.leaveAll = function(socket) {
  for (var i = 0; i < socket.duelData.subscribedRooms.length; i++) {
    var room = socket.duelData.subscribedRooms[i];

    socket.leave(room);
    clientConnections.remove(room, socket.id);
    sendTo(room, 'chat/update', clientConnections.getClients(room));
  }

  socket.duelData.subscribedRooms = [];
}

/*
 *  Removes the client socket from a room
 */
exports.leave = function(msg, socket) {
  var room = msg.data.room;
  var userId = msg.data.userId;

  console.log(userId + ' left ' + room);

  socket.leave(room);
  clientConnections.remove(room, socket.id);
  sendTo(room, 'chat/update', clientConnections.getClients(room));

  var index = socket.duelData.subscribedRooms.indexOf(room);
  socket.duelData.subscribedRooms.splice(index, 1);
}
