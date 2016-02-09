/*
 *  Controllers
 *
 *  var featureController = require('./featureController.js');
 */

var gameController = require('../controllers/gameController.js');
var userController = require('../controllers/userController.js');

module.exports = function(apiRouter) {

  /*
   *  API routes - all routes here are prefixed with 'api/'
   *
   *  GET request to localhost:3000/api/feature
   *  apiRouter.get('/feature', featureController.someFunction);
   */

   apiRouter.post('/game/create', gameController.createGame);
   apiRouter.post('/game/unlock', gameController.unlock);
   apiRouter.get( '/user/:githubName', userController.findOne);
   apiRouter.post('/user/login',       userController.login);
};
