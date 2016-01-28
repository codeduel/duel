//add models in case we need them later
var Game = require('./gameModel.js').Game;
var User = require('./userModel.js').User;

//builds Game object to return to client
module.exports.buildGameObj = function(gameModel) {
  return {
    gameId: gameModel.gameId,
    players: gameModel.players,
    active: gameModel.active,
    spectator : gameModel.spectators,
    question: gameModel.question,
    initialCode: gameModel.initialCode
  };
};

//builds User object to return to client
//sensitive fields are set to null but retain their structure for consistancy between client and server
//uses short-circuit evaluation to set items to undefined if their parent object doesn't exist preventing errors
module.exports.buildUserObj = function(userModel) {
  return {
    userName: userModel.userName,
    authMethods: {
      gitHubAuth: userModel.authMethods && userModel.authMethods.gitHubAuth,
      passwordAuth: userModel.authMethods && userModel.authMethods.passwordAuth
    },
    passwordAuth: {
      email: userModel.passwordAuth && userModel.passwordAuth.email,
      //set password to null when sending to the client to minimise exposure...
      password: null
    },
    gitHubAuth: {
      login: userModel.gitHubAuth && userModel.gitHubAuth.login,
      name: userModel.gitHubAuth && userModel.gitHubAuth.name,
      email: userModel.gitHubAuth && userModel.gitHubAuth.email,
      location: userModel.gitHubAuth && userModel.gitHubAuth.location,
      avatar_url: userModel.gitHubAuth && userModel.gitHubAuth.avatar_url
    }
  };
};
