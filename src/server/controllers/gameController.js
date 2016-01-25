//Imports the codewars Controller to make requests to/from the Code Wars API
var codewarsController = require('./codewarsController.js');
//Imports the sendTo function from socketRoutes
var sendTo = require('../api/socketRoutes.js').sendTo;
//Imports the constructor for a SolutionsQueue data structure
var fastQueue = require('../models/fastQueue.js');

/*
 *  Object that holds all game sessions in memory
 *  TODO: refactor to pull from DB
 */
var games = {};

/*
 *  Custom queue data structure that will hold all dmid's generated from submitSolutions function
 */
var solutionsQueue = new fastQueue();

/*
 *  Interval between dmid queries to the Code Wars API
 *  ***DO NOT SET LOWER THAN 500***
 */
var apiPollInterval = 750;

//***************
//INNER FUNCTIONS
//***************

/*
 *  Resolves a solution attempt by dequeueing it and querying its dmid against the Code Wars API
 */
var resolveSolutionAttempt = function() {
  //peek first, in case the queued solution is not done processing on the Code Wars server
  var solutionAttempt = solutionsQueue.peek();
  if (solutionAttempt) {
    codewarsController.getSolutionResults(solutionAttempt.dmid)
      .then(function(data) {
        data = JSON.parse(data);
        //If the solution is done processing
        if (data.valid === true || data.valid === false) {
          if (data.valid) {
            //emit 'challenge/winner' event to everyone in the game
            sendTo(solutionAttempt.gameid, 'challenge/winner', {
              winner: solutionAttempt.submittedBy
            })
          } else {
            //emit 'challenge/invalidSolution' event to origin of the solution
            sendTo(solutionAttempt.socketid, 'challenge/invalidSolution', data);
          }
          //remove the solution
          solutionsQueue.dequeue();
        }
      }, function(err) {
        throw err;
      })
  }
}
setInterval(resolveSolutionAttempt, apiPollInterval);

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
    }, function(err) {
      throw err;
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

/*
 *  Adds the specified user to the specified game, and sends a "challenge/start" event to all clients connected to the game
 */
exports.submitSolution = function(msg, socket) {
  var game = games[msg.data.gameid];

  codewarsController.submitSolution(game.sID, game.pID, msg.data.solution)
    .then(function(data) {
      if (data.success) {
        solutionsQueue.enqueue({
          dmid: data.dmid,
          gameid: msg.data.gameid,
          submittedBy: msg.data.userid,
          socketid: socket.id
        });
      }
    }, function(err) {
      throw err;
    });
}
