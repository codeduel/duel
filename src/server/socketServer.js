module.exports = function(server) {
  var io = require('socket.io')(server);

  console.log('Socket.io server successfully mounted.')


  io.on('connection', function(socket) {

    socket.on('challenge/ready', function(msg) {
      console.log(msg.data.userid + ' joined ' + msg.data.gameid);
    })

    socket.on('disconnect', function() {});
  });
}
