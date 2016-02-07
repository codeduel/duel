//Imports the codewars Controller to make requests to/from the Code Wars API
var codewarsController = require('./codewarsController.js');
//Imports the sendTo function from socketRoutes
var sendTo = require('../api/socketRoutes.js').sendTo;
//Imports the socketError function from socketRoutes
var socketError = require('../api/socketRoutes.js').socketError;
//Imports the constructor for a SolutionsQueue data structure
var fastQueue = require('../models/fastQueue.js');
//Imports the game model
var Game = require('../models/gameModel.js').Game;
//Imports the client connections model
var clientConnections = require('../models/clientConnectionsModel.js');
//Imports model helper functions
var modelHelpers = require('../models/modelHelpers.js');


//Custom queue data structure that will hold all dmid's generated from submitSolutions function
var solutionsQueue = new fastQueue();

/*
 *  Interval between dmid queries to the Code Wars API
 *  ***DO NOT SET LOWER THAN 500***
 */
var apiPollInterval = 750;

//Maximum number of attempts a solution can query against Code Wars before it's deemed a failure
var maxAttempts = 10;

//***************
//INNER FUNCTIONS
//***************

//Resolves a solution attempt by dequeueing it and querying its dmid against the Code Wars API
var resolveSolutionAttempt = function() {
  //peek first, in case the queued solution is not done processing on the Code Wars server
  var solutionAttempt = solutionsQueue.peek();
  if (solutionAttempt) {
    if (solutionAttempt.attempts >= maxAttempts) {
      console.log(solutionAttempt.dmid + ' has exceeded maximum number of attempts.');
      sendTo(solutionAttempt.socketId, 'chat/message', {
        userId: 'SYSTEM',
        text: 'Sorry, your solution attempt timed out. Please try again.',
        bold: true
      });
      solutionsQueue.dequeue();
      resolveSolutionAttempt();
    }
    codewarsController.getSolutionResults(solutionAttempt.dmid)
      .then(function(data) {
        //If the solution is done processing
        if (data.valid === true || data.valid === false) {
          if (data.valid) {
            //emit 'game/winner' event to players
            sendTo(solutionAttempt.gameId, 'game/winner', {
              winner: solutionAttempt.submittedBy
            });
            //emit 'watch/winner' event to spectators
            sendTo(solutionAttempt.gameId + '/watch', 'watch/winner', {
              winner: solutionAttempt.submittedBy
            });
          } else {
            //emit 'game/invalidSolution' event to origin of the solution
            sendTo(solutionAttempt.socketid, 'game/invalidSolution', data);

            sendTo(solutionAttempt.gameId, 'chat/message', {
              userId: 'SYSTEM',
              text: solutionAttempt.submittedBy + ' submitted an invalid solution!',
              bold: true
            });

            sendTo(solutionAttempt.gameId + '/watch', 'chat/message', {
              userId: 'SYSTEM',
              text: solutionAttempt.submittedBy + ' submitted an invalid solution!',
              bold: true
            });
          }
          //remove the solution
          console.log(solutionAttempt.dmid + ' has been processed.');
          solutionsQueue.dequeue();
          repeat();
        } else {
          //solution is still processing
          console.log(solutionAttempt.dmid + ' is still processing.');
          solutionAttempt.attempts++;
          //move the solution to the end of the queue
          solutionsQueue.enqueue(solutionsQueue.dequeue());
          repeat();
        }
      }, function(error) {
        //API timed out
        console.log(solutionAttempt.dmid + ' timed out.');
        sendTo(solutionAttempt.socketId, 'chat/message', {
          userId: 'SYSTEM',
          text: 'Sorry, your solution attempt timed out. Please try again.',
          bold: true
        });
        solutionsQueue.dequeue();
        repeat();
      });
  } else {
    repeat();
  }

};

var repeat = function() {
  setTimeout(function() {
    resolveSolutionAttempt();
  }, apiPollInterval);
};

resolveSolutionAttempt();

//****************
//HTTP CONTROLLERS
//****************

//Generates a Game in database
exports.createGame = function(req, res) {
  codewarsController.generateQuestion(req.body.difficulty)
    .then(function(data) {
      new Game({
        question: data.description,
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
  })
}

//********************
//SOngCKET CONTROLLERS
//********************

//Adds the specified user to the specified game, and sends a "game/start" event to all clients connected to the game
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
              socketid: socket.id,
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
};

//removes games over a day old or emptied in the last hour
var cleanStaleGames = function(cleanInterval) {
  oneMinuteAgo = new Date(Date.now() - 60000);
  oneHourAgo = new Date(Date.now() - 3600000);
  oneDayAgo = new Date(Date.now() - 86400000);
  //remove all day old games
  Game.find({
    "createdAt": {
      "$lt": oneDayAgo
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
      "lastEmpty": {
        "$lt": oneHourAgo
      }
    }, {
      "isEmpty": true
    }, {
      "active": false
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
