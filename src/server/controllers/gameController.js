//Imports the codewars Controller to make requests to/from the Code Wars API
var codewarsController = require('./codewarsController.js');
//Imports the sendTo function from socketRoutes
var sendTo = require('../api/socketRoutes.js').sendTo;
//Imports the constructor for a SolutionsQueue data structure
var SolutionsQueue = require('../models/solutionsQueue.js');

/*
 *  Object that holds all game sessions in memory
 *  TODO: refactor to pull from DB
 */
var games = {};

var solutionsQueue = new SolutionsQueue();

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
      games[gameid] = {
        players: [],
        active: false,
        spectators: [], //TODO: implement spectators
        createdAt: Date.now(),
        question: data.description,
        initialCode: data.session.setup,
        pID: data.session.projectId,
        sID: data.session.solutionId,
        rank: data.rank
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
  //Connects the player to the gameid's socket room
  socket.join(msg.data.gameid); //TODO: implement separate socket rooms for chat,etc

  var game = games[msg.data.gameid];
  game.players.push(msg.data.userid);

  if (game.players.length === 2) {
    game.active = true;
    sendTo(msg.data.gameid, 'challenge/gameStart', game);
  }
}

exports.submitSolution = function(msg, socket) {
  var game = games[msg.data.gameid];

  codewarsController.submitSolution(game.sID, game.pID, msg.data.solution)
    .then(function(data) {
      console.log(data);
    })
}
