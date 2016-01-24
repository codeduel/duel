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
  games[gameid] = {
    difficulty: req.body.difficulty,
    players: [],
    active: false,
    spectators: [], //TODO: implement spectators
    createdAt: Date.now(),
    question: 'This is a question' //TODO: pull from codewars api
  }

  //Sends a response to the client with the gameid
  res.send({
    gameid: gameid
  });
}

//********************
//SOngCKET CONTROLLERS
//********************


exports.playerJoin = function(msg, socket) {
  socket.join(msg.data.gameid); //TODO: implement separate socket rooms for chat,etc

  games[msg.data.gameid].players.push(msg.data.userid);
  console.log(games);

  //player 1 creates game, and joins
    //playerJoin(); --> players === ['player1']

  //player 2 joins the same game
    //playerJoin(); --> players === ['player1', 'player2']
      //broadcast 'gameStart' event to both players
}
