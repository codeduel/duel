//Imports the codewars Controller to make requests to/from the Code Wars API
var codewarsController = require('./codewarsController.js');
//Imports the sendTo function from socketRoutes
var sendTo = require('../api/socketRoutes.js').sendTo;
//Imports the socketError function from socketRoutes
var socketError = require('../api/socketRoutes.js').socketError;
//Imports the constructor for a SolutionsQueue data structure
var FastQueue = require('../models/fastQueue.js');
//Imports the game model
var Game = require('../models/gameModel.js').Game;
//Imports the client connections model
var clientConnections = require('../models/clientConnectionsModel.js');
//Imports model helper functions
var modelHelpers = require('../models/modelHelpers.js');
//Imports the Analytics library to make pipe server side analytics
var Analytics = require('analytics-node');
var analytics = new Analytics('59YB1CrcYkdrsCsPWtFbpxPjeEe3SCJX', {
  flushAt: 1
});



//Custom queue data structure that will hold all dmid's generated from submitSolutions function
var solutionsQueue = new FastQueue();

//Structure for tracking the last time a player submitted a solution
var lastSubmittedSolution = {};

//Minimum time (in ms) between submission attempts
var SOLUTION_COOLDOWN = 10000;

/*
 *  Interval between dmid queries to the Code Wars API
 *  ***DO NOT SET LOWER THAN 500***
 */
var API_POLL_INTERVAL = 750;

//Maximum number of attempts a solution can query against Code Wars before it's deemed a failure
var MAX_ATTEMPTS = 10;

//***************
//INNER FUNCTIONS
//***************

//Prettifies a question string by formatting it to HTML
var format = function(str) {
  return str.replace(/\n/g, '<br>').replace(/```/g, '');
};

//Calculates a solution's progress to being completed
var calculateProgress = function(passed, failed) {
  return Math.floor(passed / (passed + failed) * 10000) / 100;
};

//Saves the winner of the game in the database
var setWinner = function(gameId) {
  Game.findOne({
    gameId: gameId
  }, function(error, foundGame) {
    if (error) {
      console.log('Could not set winner in game ' + gameId);
      socketError(socket.id, 'playerJoin', {
        userErrorMessage: 'There was a problem with your game...'
      });
    }
    if (foundGame) {
      foundGame.winner = true;
      foundGame.save();
    }
  });
};

//Resolves a solution attempt by dequeueing it and querying its dmid against the Code Wars API
var resolveSolutionAttempt = function() {
  //peek first, in case the queued solution is not done processing on the Code Wars server
  var solutionAttempt = solutionsQueue.peek();
  if (solutionAttempt) {
    if (solutionAttempt.attempts >= MAX_ATTEMPTS) {
      console.log(solutionAttempt.dmid + ': Exceeded Maximum Attempts');
      sendTo(solutionAttempt.socketId, 'chat/message', {
        userId: 'SYSTEM',
        text: 'Sorry, your solution attempt timed out. Please try again.',
        bold: true
      });
      solutionsQueue.dequeue();
      repeat();
    } else {
      codewarsController.getSolutionResults(solutionAttempt.dmid)
        .then(function(data) {
          if (data.valid === true || data.valid === false) {
            //solution is done processing
            var msg = {
              userId: 'SYSTEM',
              bold: true
            };
            if (data.valid) {
              msg.text = solutionAttempt.submittedBy + ' has completed the challenge! Remaining players may keep coding or go back to the lobby.';
            } else {
              var progress = calculateProgress(data.summary.passed, data.summary.failed);
              msg.text = solutionAttempt.submittedBy + ' submitted an invalid solution! (Progress: ' + progress + '%)';
            }

            //send results message to players
            sendTo(solutionAttempt.gameId, 'chat/message', msg);
            //send results message to spectators
            sendTo(solutionAttempt.gameId + '/watch', 'chat/message', msg);
            //send the solution results to the player
            sendTo(solutionAttempt.socketId, 'game/results', data);

            //analytics call
            analytics.track({
              userId: solutionAttempt.submittedBy,
              event: 'Submitted Solution - Server',
              properties: {
                valid: data.valid,
                gameid: solutionAttempt.gameId,
                summary: data.summary
              },
            });

            console.log(solutionAttempt.dmid + ': Done');
            solutionsQueue.dequeue();
          } else {
            //solution is still processing, move it to the end of the queue to be checked later
            console.log(solutionAttempt.dmid + ': Delayed');
            solutionAttempt.attempts++;
            solutionsQueue.enqueue(solutionsQueue.dequeue());
          }
          repeat();
        }, function(error) {
          //API timed out
          console.log(solutionAttempt.dmid + ': Timed out');
          sendTo(solutionAttempt.socketId, 'chat/message', {
            userId: 'SYSTEM',
            text: 'Sorry, your solution attempt timed out. Please try again.',
            bold: true
          });
          solutionsQueue.dequeue();
        });
    }
  } else {
    repeat();
  }

};

//recursive timeout function to continuously dequeue the solutions queue
var repeat = function() {
  setTimeout(function() {
    resolveSolutionAttempt();
  }, API_POLL_INTERVAL);
};

//Start the dequeue process
resolveSolutionAttempt();

//****************
//HTTP CONTROLLERS
//****************

//Generates a Game in database
exports.createGame = function(req, res) {
  codewarsController.generateQuestion(req.body.difficulty)
    .then(function(data) {
      new Game({
        question: format(data.description),
        initialCode: data.session.setup,
        projectId: data.session.projectId,
        solutionId: data.session.solutionId,
        rank: data.rank,
        password: req.body.password
      }).save(function(error, createdGame) {
        if (error) {
          console.log('error saving new game in gameController.js');
          res.status(500).send(error);
          return;
        }
        clientConnections.addGroup(createdGame.gameId);
        res.send({
          gameId: createdGame.gameId
        });
        analytics.track({
          userId: req.body.userName,
          event: 'Created Game - Server',
          properties: {
            difficulty: req.body.difficulty,
            rank: createdGame.rank,
            gameId: createdGame.gameId,
            createdAt: createdGame.createdAt
          }
        });
      });
    }, function(error) {
      console.log('error generating question in gameController.js');
      res.status(500).send(error);
    });
};

//Authenticates an unlock attempt on a locked game
exports.unlock = function(req, res) {
  Game.findOne({
    gameId: req.body.gameId,
    password: req.body.password
  }, function(error, foundGame) {
    if (foundGame) {
      res.status(200).send();
    } else {
      res.status(401).send();
    }
  });
};

//Checks if the game exists
exports.verify = function(req, res) {
  Game.findOne({
    gameId: req.query.gameId
  }, function(error, foundGame) {
    if (foundGame) {
      res.send({
        found: true
      });
    } else {
      res.send({
        found: false
      });
    }
  });
};

//********************
//SOngCKET CONTROLLERS
//********************

//Adds the specified user to the specified game, and sends a 'game/start' event to all clients connected to the game
exports.playerJoin = function(msg, socket) {
  var gameArray;
  //check for all the right data, otherwise throw an error
  if (!msg || !socket || !msg.data || !msg.data.gameId || !msg.data.userId || !socket.id) {
    console.log('Function call error in function playerJoin in gameController.js');
    socketError(socket.id, 'playerJoin', {
      userErrorMessage: 'Unfortunately we couldn\'t start your game!'
    });
    return;
  }
  //Connects the player to the gameId's socket room
  socket.join(msg.data.gameId); //TODO: implement separate socket rooms for chat,etc

  Game.findOne({
    gameId: msg.data.gameId
  }, function(error, foundGame) {
    if (error) {
      console.log('Database error in function playerJoin in gameController.js');
      socketError(socket.id, 'playerJoin', {
        userErrorMessage: 'Unfortunately we couldn\'t start your game!'
      });
    }
    //if we find the game and it exists in clientConnections
    if (foundGame && clientConnections.getClients(msg.data.gameId)) {
      //add the gameId to the socket
      socket.duelData.inGameId = msg.data.gameId;
      //add the user to the game in clientConnections then get array of players
      clientConnections.add(msg.data.gameId, socket.id, msg.data.userId);
      gameArray = clientConnections.getClientsArray(msg.data.gameId);

      //analytics call
      analytics.track({
        userId: msg.data.userId,
        event: 'Joined to Play - Server',
        properties: {
          gameId: msg.data.gameId,
          numberOfPlayers: gameArray.length,
          playerArray: gameArray
        }
      });

      //set isEmpty flag to false on game model and save
      foundGame.isEmpty = false;
      foundGame.save();
      sendTo(msg.data.gameId, 'chat/message', {
        userId: 'SYSTEM',
        text: msg.data.userId + ' has joined the game!',
        bold: true
      });
      sendTo(msg.data.gameId + '/watch', 'chat/message', {
        userId: 'SYSTEM',
        text: msg.data.userId + ' has joined the game!',
        bold: true
      });
      //make game active if there are 2 or more players
      if (gameArray.length > 1) {
        foundGame.active = true;
        foundGame.save();
        sendTo(msg.data.gameId, 'game/start', modelHelpers.buildGameObj(foundGame));
        sendTo(msg.data.gameId + '/watch', 'watch/prompt', {question: foundGame.question});
      }
    } else {
      console.log('Game not found in function playerJoin in gameController.js');
      socketError(socket.id, 'playerJoin', {
        userErrorMessage: 'Unfortunately we couldn\'t start your game!'
      });
    }
  });
};

//removes user from a game and sets the appropriate flags on the game
exports.playerLeave = function(socket) {
  var gameArray;
  var playerGameId;
  //check for all the right data, otherwise throw an error
  if (!socket || !socket.duelData) {
    console.log('Function call error in function playerLeave in gameController.js');
    return;
  }

  playerGameId = socket.duelData.inGameId;

  Game.findOne({
    gameId: playerGameId
  }, function(error, foundGame) {
    if (error) {
      console.log('Database error in function playerLeave in gameController.js');
    }
    //if we find the game and it exists in clientConnections...
    if (foundGame && clientConnections.getClients(playerGameId)) {
      //remove the gameId from the socket
      socket.duelData.inGameId = null;
      //remove the user from the game in clientConnections then get array of players
      clientConnections.remove(playerGameId, socket.id);
      console.log(socket.id + ' left ' + playerGameId);
      gameArray = clientConnections.getClientsArray(playerGameId);
      //make game empty and inactive if there are no more players
      if (gameArray.length === 0) {
        //set isEmpty flag to false on game model and save
        foundGame.isEmpty = true;
        foundGame.active = false;
        foundGame.lastEmpty = Date.now();
        foundGame.save();
      }
    }
  });
};

//Adds the specified user to the specified game, and sends a "game/start" event to all clients connected to the game
exports.submitSolution = function(msg, socket) {

  Game.findOne({
    gameId: msg.data.gameId
  }, function(error, foundGame) {
    if (!foundGame.active) {
      sendTo(socket.id, 'chat/message', {
        userId: 'SYSTEM',
        text: 'Game has not started yet!',
        bold: true
      });
    } else {
      //Check if sufficient time has passed since last submission
      var lastSubmit = lastSubmittedSolution[socket.id] || 0;
      if (Date.now() - lastSubmit < SOLUTION_COOLDOWN) {
        sendTo(socket.id, 'chat/message', {
          userId: 'SYSTEM',
          text: 'You already submitted a solution recently. Please wait ' + (10 - Math.floor((Date.now() - lastSubmit) / 1000)) + ' seconds.',
          bold: true
        });
        return;
      } else {
        lastSubmittedSolution[socket.id] = Date.now();
      }

      Game.findOne({
        gameId: msg.data.gameId
      }, function(error, foundGame) {
        if (error) {
          console.log('Database error in function submitSolution in gameController.js');
          socketError(socket.id, 'submitSolution', {
            userErrorMessage: 'Unfortunately something went wrong when submitting your solution!'
          });
        }
        if (foundGame) {
          codewarsController.submitSolution(foundGame.solutionId, foundGame.projectId, msg.data.solution)
            .then(function(data) {
              if (data.success) {
                solutionsQueue.enqueue({
                  dmid: data.dmid,
                  gameId: msg.data.gameId,
                  submittedBy: msg.data.userId,
                  socketId: socket.id,
                  attempts: 0
                });
              } else {
                console.log('Codewars API error in function submitSolution in gameController.js');
                socketError(socket.id, 'submitSolution', {
                  userErrorMessage: 'Unfortunately something went wrong when submitting your solution!'
                });
              }
            }, function(err) {
              //If error submitting solution... TODO: implement better error handling
              throw err;
            });
        } else {
          console.log('Game not found in function submitSolution in gameController.js');
          socketError(socket.id, 'submitSolution', {
            userErrorMessage: 'Unfortunately something went wrong when submitting your solution!'
          });
        }
      });
    }
  });
};

//removes games over a day old or emptied in the last hour
var cleanStaleGames = function(cleanInterval) {
  oneMinuteAgo = new Date(Date.now() - 60000);
  oneHourAgo = new Date(Date.now() - 3600000);
  oneDayAgo = new Date(Date.now() - 86400000);
  //remove all day old games
  Game.find({
    'createdAt': {
      '$lt': oneDayAgo
    }
  }, function(error, foundGamesArray) {
    if (error) {
      console.log('Database error in function cleanStaleGames in gameController.js');
    }
    if (foundGamesArray) {
      foundGamesArray.forEach(function(foundGame) {
        foundGame.remove();
      });
    }
  });
  //remove recently emptied games
  Game.find({
    $and: [{
      'lastEmpty': {
        '$lt': oneHourAgo
      }
    }, {
      'isEmpty': true
    }, {
      'active': false
    }]
  }, function(error, foundGamesArray) {
    if (error) {
      console.log('Database error in function cleanStaleGames in gameController.js');
    }
    if (foundGamesArray) {
      foundGamesArray.forEach(function(foundGame) {
        foundGame.remove();
      });
    }
  });
  setTimeout(cleanStaleGames, cleanInterval);
};

//clean stale games every 5 mins
cleanStaleGames(300000);
