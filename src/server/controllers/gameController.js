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
//Imports model helper functions
var modelHelpers = require('../models/modelHelpers.js');

/*
 *  Custom queue data structure that will hold all dmid's generated from submitSolutions function
 */
var solutionsQueue = new fastQueue();

/*
 *  Interval between dmid queries to the Code Wars API
 *  ***DO NOT SET LOWER THAN 500***
 */
var apiPollInterval = 750;

/*
 *  Maximum number of attempts a solution can query against Code Wars before it's deemed a failure
 */
var maxAttempts = 10;


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
    if (solutionAttempt.attempts >= maxAttempts) {
      console.log(solutionAttempt.dmid + ' has exceeded maximum number of attempts.');
      solutionsQueue.dequeue();
      repeat();
    }
    codewarsController.getSolutionResults(solutionAttempt.dmid)
      .then(function(data) {
        //If the solution is done processing
        if (data.valid === true || data.valid === false) {
          if (data.valid) {
            //emit 'game/winner' event to everyone in the game
            sendTo(solutionAttempt.gameId, 'game/winner', {
              winner: solutionAttempt.submittedBy
            });
          } else {
            //emit 'game/invalidSolution' event to origin of the solution
            sendTo(solutionAttempt.socketid, 'game/invalidSolution', data);
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
        solutionsQueue.dequeue();
        repeat();
      });
  } else {
    repeat();
  }

};

var repeat = function() {
  setTimeout(function() {
    resolveSolutionAttempt()
  }, apiPollInterval);
}

resolveSolutionAttempt();

//****************
//HTTP CONTROLLERS
//****************

/*
 *  Generates a Game in database
 */
exports.createGame = function(req, res) {
  codewarsController.generateQuestion(req.body.difficulty)
    .then(function(data) {
      new Game({
        active: false,
        question: data.description,
        initialCode: data.session.setup,
        projectId: data.session.projectId,
        solutionId: data.session.solutionId,
        rank: data.rank
      }).save(function(error, createdGame) {
        if (error) {
          console.log('error saving new game in gameController.js');
          res.status(500).send(error);
        }
        res.send({
          gameId: createdGame.gameId
        });
      });

    }, function(error) {
      console.log('error generating question in gameController.js');
      res.status(500).send(error);
    });
};

//********************
//SOngCKET CONTROLLERS
//********************

/*
 *  Adds the specified user to the specified game, and sends a "game/start" event to all clients connected to the game
 */
exports.playerJoin = function(msg, socket) {
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
    if (foundGame) {
      foundGame.players.push(msg.data.userId);
      foundGame.save();
      //make game active if there are 2 or more players
      if (foundGame.players.length === 2) {
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
/*
 *  Adds the specified user to the specified game, and sends a "game/start" event to all clients connected to the game
 */
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
