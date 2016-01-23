/*
 *  Object that holds all game sessions in memory
 *  TODO: refactor to pull from DB
 */
var games = {};

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
