module.exports = function(server) {
  var io = require('socket.io')(server);

  console.log('Socket.io server successfully mounted.')


  io.on('connection', function(socket){

  socket.on('chat message', function(msg){
    
  });

  socket.on('disconnect', function(){
  });
});
}
