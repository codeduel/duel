//Imports the model to map out all client connections
var clientConnectionsModel = require('../models/clientConnectionsModel.js');
//Imports the sendTo function from socketRoutes
var sendTo = require('../api/socketRoutes.js').sendTo;

//Data structure to map all client connections to rooms
var clients = new clientConnectionsModel();

//***************
//INNER FUNCTIONS
//***************

/*
 *  Adds the client socket to a room
 */
exports.join = function(msg, socket) {
  var room = msg.data.room;
  var userId = msg.data.userId;

  clients.add(room, socket.id, userId);

  socket.subscribedRooms.push(room);
  socket.join(room);
  console.log(userId + ' joined ' + room);
  sendTo(room, 'chat/update', clients.getClients(room));
}

/*
 *  Removes the client socket from all rooms
 */
 exports.leaveAll = function(socket) {
  for(var i = 0; i < socket.subscribedRooms.length; i++) {
    var room = socket.subscribedRooms[i];
    
    socket.leave(room);
    clients.remove(room, socket.id);
    sendTo(room, 'chat/update', clients.getClients(room));
  }

  socket.subscribedRooms = [];
 }