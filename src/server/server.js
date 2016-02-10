var express = require('express');
var mongoose = require('mongoose');
var socketio = require('socket.io');
var socketRoutes = require('./api/socketRoutes.js');

var port = process.env.PORT || 3000;
var dbURL = 'mongodb://localhost/duel';

var app = express();

require('./config/passportAuth.js')(app); //must list before middleware
require('./config/middleware.js')(app, express);

var server = app.listen(port, function() {
  console.log('Server listening on port ' + port);
});

// use https when deployed to heroku
// note headers can be spoofed so this isn't very reliable
// but req.secure doesn't work in heroku
var checkHerokuHTTPS = function(req, res, next) {
  //if we aren't on local host force ssl
  if (process.env.NODE_ENV === 'production') {
    if (req.header('x-forwarded-proto') !== 'https') {
      return res.redirect('https://' + req.headers.host + req.url);
    }
  }
  next();
};
//add https middleware
app.use(checkHerokuHTTPS);

//mongoose connection setup for heroku deployment
if (process.env.NODE_ENV !== 'production') {
  mongoose.connect('mongodb://localhost/duel', function(err, res) {
    if(err) {
      console.log('Can not connect to database!');
    } else {
      console.log('Connected to database.');
    }
  });
} else {
  mongoose.connect(process.env.MONGOLAB_URI, function(err, res) {
    if(err) {
      console.log('Can not connect to database!');
    } else {
      console.log('Connected to database.');
    }
  });
}

//mount express https server with socketio
var io = socketio(server);
console.log('Socket.io server successfully mounted.');

//init socket routes
socketRoutes.init(io);

//export express server
module.exports.app = app;
