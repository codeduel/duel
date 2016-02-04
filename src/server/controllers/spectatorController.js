//Imports the sendTo function from socketRoutes
var sendTo = require('../api/socketRoutes.js').sendTo;
//Imports the socketError function from socketRoutes
var socketError = require('../api/socketRoutes.js').socketError;

exports.stream = function(msg, socket) {
  sendTo(msg.data.gameId + '/watch', 'watch/update', {
    userId: msg.data.userId,
    code: msg.data.code
  });
}