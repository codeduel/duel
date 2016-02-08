/***********************************/
/*  BROWSERIFY INCLUDES            */
/*  src="assets/js/allScripts.js"  */
/***********************************/

//Libraries
require('../../../bower_components/ace-builds/src-min-noconflict/ace.js');
require('../../../bower_components/angular/angular.js');
require('../../../bower_components/angular-ui-router/release/angular-ui-router.js');
require('../../../bower_components/angular-bootstrap/ui-bootstrap.min.js');
require('../../../bower_components/angular-ui-ace/ui-ace.js');
require('../../../bower_components/jquery/dist/jquery.js');
require('../../../bower_components/angular-scroll-glue/src/scrollglue.js');

//Factories/Providers/Services
require('./util/socketFact.js');
require('./util/userFact.js');
require('./util/errorFact.js');
require('./chat/chatFact.js');
require('./lobby/lobbyFact.js');
require('./game/play/gamePlayFact.js');
require('./game/watch/gameWatchFact.js');

//Controllers
require('./app.js');
require('./login/loginCtrl.js');
require('./lobby/lobbyCtrl.js');
require('./chat/chatCtrl.js');
require('./chat/chatClientsCtrl.js');
require('./game/gameCtrl.js');
require('./game/play/gamePlayCtrl.js');
require('./game/watch/gameWatchCtrl.js');
require('./auth/authCtrl.js');
require('./showError/showErrorCtrl.js');

angular.module('duel', [

  //Third-party
  'ui.router', //angular router
  'ui.bootstrap', //bootstrap
  'ui.ace', //ace editor
  'luegg.directives', //scroll-glue for sticky overflow

  //Controllers
  'duel.loginCtrl', //Controller for 'login' state
  'duel.authCtrl', //Controller for 'auth' state
  'duel.lobbyCtrl', //Controller for 'lobby' state
  'duel.gameCtrl', //Controller for 'game' state
  'duel.game.playCtrl', //Controller for 'game.play' state
  'duel.game.watchCtrl', //Controller for 'game.watch' state
  'duel.showErrorCtrl', //Controller for 'showError' state
  'duel.chat.clientsCtrl', //Universal connected clients controller
  'duel.chatCtrl', //Universal chat controller

  //Factories
  'duel.socketFact', //Factory for creating socket connections
  'duel.errorFact', //Factory for handling errors
  'duel.userFact', //Factory for storing user session data
  'duel.chatFact', //Factory for joining/leaving/messaging chat rooms
  'duel.lobbyFact', //Factory for creating/joining a game session
  'duel.game.watchFact', //Factory for spectating
  'duel.game.playFact' //Factory for gameplay
])

.run(['$rootScope', 'ChatFact', function($rootScope, ChatFact) {

  //Socket room router
  $rootScope.$on('$stateChangeSuccess',
    function(event, toState, toParams, fromState, fromParams, options) {

      //leaving a state
      if (fromState.name === 'game.play' || fromState.name === 'game.watch') {
        var room = fromParams.gameId;
        if (fromState === 'game.watch') room += '/watch';
        ChatFact.leaveRoom();
      }
      if (fromState.name === 'lobby') {
        ChatFact.leaveRoom();
      }

      //entering a state
      if (toState.name === 'game.play' || toState.name === 'game.watch') {
        var room = toParams.gameId;
        if (toState.name === 'game.watch') room += '/watch';
        ChatFact.joinRoom(room);
      }
      if (toState.name === 'lobby') {
        ChatFact.joinRoom('lobby');
      }

      //clear messages
      ChatFact.reset();
    });
}])

//temporary controller until I can refactor ErrorFact as a provider
.controller('appController', ['ErrorFact', function(ErrorFact) {

}])

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/login');

  $stateProvider
    .state('login', {
      url: '/login',
      views: {
        'duelContent@': {
          templateUrl: 'app/login/login.html',
          controller: 'LoginCtrl'
        }
      }
    })

  .state('auth', {
    url: '/auth/:userId/:userName', // Server routes back here after authenticating with GitHub
    views: {
      'duelContent@': {
        templateUrl: 'app/login/login.html',
        controller: 'AuthCtrl'
      }
    }
  })

  .state('lobby', {
    url: '/lobby/:userName',
    views: {
      'duelContent@': {
        templateUrl: 'app/lobby/lobby.html',
        controller: 'LobbyCtrl'
      },
      'chat@lobby': {
        templateUrl: 'app/chat/views/lobby/lobbyChat.html',
        controller: 'ChatCtrl'
      },
      'users@lobby': {
        templateUrl: 'app/chat/views/lobby/lobbyClients.html',
        controller: 'ChatClientsCtrl'
      }
    }
  })

  .state('game', {
    url: '/game/:gameId',
    params: {
      gameId: null
    },
    views: {
      'duelContent@': {
        templateUrl: 'app/game/game.html',
        controller: 'GameCtrl'
      }
    }
  })

  .state('game.play', {
    params: {
      gameId: null
    },
    views: {
      'duelContent@': {
        templateUrl: 'app/game/play/gamePlay.html',
        controller: 'GamePlayCtrl'
      },
      'chat@game.play': {
        templateUrl: 'app/chat/views/dashboard/gameDashboardChat.html',
        controller: 'ChatCtrl'
      },
      'users@game.play': {
        templateUrl: 'app/chat/views/dashboard/gamePlayDashboardClients.html',
        controller: 'ChatClientsCtrl'
      }
    }
  })

  .state('game.watch', {
    params: {
      gameId: null
    },
    views: {
      'duelContent@': {
        templateUrl: 'app/game/watch/gameWatch.html',
        controller: 'GameWatchCtrl'
      },
      'chat@game.watch': {
        templateUrl: 'app/chat/views/dashboard/gameDashboardChat.html',
        controller: 'ChatCtrl'
      },
      'users@game.watch': {
        templateUrl: 'app/chat/views/dashboard/gameWatchDashboardClients.html',
        controller: 'ChatClientsCtrl'
      }
    }
  })

  .state('showError', {
    params: {
      errorType: undefined,
      errorData: undefined
    },
    views: {
      'duelContent@': {
        templateUrl: 'app/showError/showError.html',
        controller: 'ShowErrorCtrl'
      }
    }
  });

}]);
