var express = require('express');
var mongoose = require('mongoose');

var app = express();
var server = require('http').Server(app);

var port = 3000; //TODO: change for deploy
var dbURL = 'mongodb://localhost/duel';

// mongoose.connect(dbURL, function(err, res) {
//   if(err) {
//     console.log('Error connecting to: ' + dbURL + '.' + err);
//   } else {
//     console.log('Succeeded connecting to: ' + dbURL);
//   }
// });

require('./config/middleware.js')(app, express);

app.listen(port, function() {
  console.log('Server listening on port ' + port);
  //Mount the websocket server onto the express server
  require('./socketServer.js')(server);
});

module.exports = {
  app: app,
  mongoose: mongoose
}