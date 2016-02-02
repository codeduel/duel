//Imports the sendTo function from socketRoutes
var sendTo = require('../api/socketRoutes.js').sendTo;
//Imports the socketError function from socketRoutes
var socketError = require('../api/socketRoutes.js').socketError;


var ROOMS = {};

/*Example rooms structure
var ROOMS = {
  'lobby': {
    123553456: 'username123',
    43243241: 'yoloswaggins'
  },

  '123-4567': {
    4334535: 'helloworld15'
  }
}
*/

//***************
//INNER FUNCTIONS
//***************

/*
 *  returns the clients in a room in the form of an object
 */
var getClients = function(room) {
  return ROOMS[room];
}


//********************
//SOngCKET CONTROLLERS
//********************

/*
 *  Adds the client socket to a room
 */
exports.join = function(msg, socket) {
  var room = msg.data.room;
  var userId = msg.data.userId;
  ROOMS[room] = ROOMS[room] || {};
  ROOMS[room][socket.id] = userId;
  socket.ROOMS.push(room);
  socket.join(room);
  console.log(userId + ' joined ' + room);
  sendTo(room, 'chat/update', getClients(room));
}

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
 *  Removes the client socket from all rooms
 *  Rejoin is an optional array of rooms to rejoin or join
 */
 exports.leaveAll = function(socket, rejoin) {
  for(var i = 0; i < socket.ROOMS.length; i++) {
    socket.leave(socket.ROOMS[i]);
    delete ROOMS[socket.ROOMS[i]][socket.id];
  }

  rejoin = rejoin || [];
  for(var i = 0; i < rejoin.length; i++) {
    socket.join(rejoin);
  }

  socket.ROOMS = rejoin;
  console.log(ROOMS);
 }