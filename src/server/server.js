var express = require('express');
var mongoose = require('mongoose');

var app = express();

var port = 3000; //TODO: change for deploy
var dbURL = 'mongodb://localhost/duel';

require('./config/passportAuth.js')(app); //must list before middleware

// mongoose.connect(dbURL, function(err, res) {
//   if(err) {
//     console.log('Error connecting to: ' + dbURL + '.' + err);
//   } else {
//     console.log('Succeeded connecting to: ' + dbURL);
//   }
// });

require('./config/middleware.js')(app, express);


var server = app.listen(port, function() {
  console.log('Server listening on port ' + port);
  //Mount the websocket server onto the express server
});

var io = require('socket.io')(server);
console.log('Socket.io server successfully mounted.');

require('./api/socketRoutes.js').init(io);

module.exports = {
  app: app,
  mongoose: mongoose
}
