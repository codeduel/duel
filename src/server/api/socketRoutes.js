/*
 *  Controllers
 *
 *  var featureController = require('./featureController.js');
 */

var gameController = require('../controllers/gameController.js');

module.exports = function(io) {
  console.log('Socket routes created.');

  io.on('connection', function(socket) {

    socket.on('challenge/ready', gameController.playerJoin);
    
    socket.on('disconnect', function() {});
  });
}
