//Imports the codewars Controller to make requests to/from the Code Wars API
var codewarsController = require('./codewarsController.js');
//Imports the sendTo function from socketRoutes
var sendTo = require('../api/socketRoutes.js').sendTo;

/*
 *  Object that holds all game sessions in memory
 *  TODO: refactor to pull from DB
 */
var games = {};


//****************
//HTTP CONTROLLERS
//****************

/*
 *  Generates a game object inside games with default properties
 */
exports.createGame = function(req, res) {
  var gameid = Math.floor(Math.random() * 100000);

  var questionDetails = codewarsController.generateQuestion(req.body.difficulty)
    .then(function(data) {
      data = JSON.parse(data);
      games[gameid] = {
        players: [],
        active: false,
        spectators: [], //TODO: implement spectators
        createdAt: Date.now(),
        question: data.description,
        initialCode: data.session.setup,
        pID: data.session.projectId,
        sID: data.session.solutionId
      }

      //Sends a response to the client with the gameid
      res.send({
        gameid: gameid
      });
    })
}

//********************
//SOngCKET CONTROLLERS
//********************

/*
 *  Adds the specified user to the specified game, and sends a "challenge/start" event to all clients connected to the game
 */
exports.playerJoin = function(msg, socket) {
  socket.join(msg.data.gameid); //TODO: implement separate socket rooms for chat,etc

  games[msg.data.gameid].players.push(msg.data.userid);

  if (games[msg.data.gameid].players.length === 2) {
    games[msg.data.gameid].active = true;
    sendTo(msg.data.gameid, 'challenge/gameStart', games[msg.data.gameid]);
  }
}
