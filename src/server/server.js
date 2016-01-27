var express = require('express');
var mongoose = require('mongoose');

var app = express();

var port = process.env.PORT || 3000;
var dbURL = 'mongodb://localhost/duel';

require('./config/passportAuth.js')(app); //must list before middleware

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

require('./config/middleware.js')(app, express);

var server = app.listen(port, function() {
  console.log('Server listening on port ' + port);
  //Mount the websocket server onto the express server
});

// use https when deployed to heroku
// note headers can be spoofed so this isn't very reliable
// but req.secure doesn't work in heroku
var checkHerokuHTTPS = function(req, res, next) {
  var ip = req.ip;
  //if we aren't on local host force ssl
  if (ip !== '::ffff:127.0.0.1' && ip != '::1') {
    if (req.header('x-forwarded-proto') !== 'https') {
      return res.redirect('https://' + req.headers.host + req.url);
    }
  }
  next();
};

app.use(checkHerokuHTTPS);

var io = require('socket.io')(server);
console.log('Socket.io server successfully mounted.');

require('./api/socketRoutes.js').init(io);

module.exports.app = app;
