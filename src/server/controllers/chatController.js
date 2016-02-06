//Imports the sendTo function from socketRoutes
var sendTo = require('../api/socketRoutes.js').sendTo;

//Imports the client connections model
var clientConnections = require('../models/clientConnectionsModel.js');

//Sends client data to their respective game rooms
var updateClients = function(room, socketId) {
  if (room !== 'lobby') {
    //check if user joined a game-room
    if (room.indexOf('/watch') !== -1) {
      //send spectator data to players
      sendTo(room.slice(0, -6), 'game/updateSpectators', clientConnections.getClients(room));
      //send initial player list to the socket
      sendTo(socketId, 'game/updatePlayers', clientConnections.getClients(room.slice(0, -6)) || {});
    } else {
      //send player data to spectators
      sendTo(room + '/watch', 'game/updatePlayers', clientConnections.getClients(room));
      //send initial spectator list to the socket
      sendTo(socketId, 'game/updateSpectators', clientConnections.getClients(room + '/watch') || {});
    }
  }

  sendTo(room, 'chat/update', clientConnections.getClients(room));
}

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
  //send a copy to spectators if in a game
  sendTo(room + '/watch', 'chat/message', {
    userId: userId,
    socketId: socket.id,
    text: text,
    bold: true
  });
}

/*
 *  Adds the client socket to a room
 */
exports.join = function(msg, socket) {
  var room = msg.data.room;
  var userId = msg.data.userId;
  var index = room.indexOf('/watch');
  clientConnections.add(room, socket.id, userId);

  socket.duelData.userId = userId;
  socket.duelData.subscribedRooms.push(room);
  socket.join(room);
  updateClients(room, socket.id);
}

/*
 *  Removes the client socket from all rooms
 */
exports.leaveAll = function(socket) {
  for (var i = 0; i < socket.duelData.subscribedRooms.length; i++) {
    var room = socket.duelData.subscribedRooms[i];

    socket.leave(room);
    clientConnections.remove(room, socket.id);
    updateClients(room);
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
  updateClients(room);

  var index = socket.duelData.subscribedRooms.indexOf(room);
  socket.duelData.subscribedRooms.splice(index, 1);
}
