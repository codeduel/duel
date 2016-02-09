/***********************************/
/*  BROWSERIFY INCLUDES            */
/*  src="assets/js/allScripts.js"  */
/***********************************/

//Libraries
require('../../../bower_components/angular/angular.js');
require('../../../bower_components/angular-ui-router/release/angular-ui-router.js');
require('../../../bower_components/angular-bootstrap/ui-bootstrap.min.js');
require('../../../bower_components/ace-builds/src-min-noconflict/ace.js');
require('../../../bower_components/ace-builds/src-min-noconflict/mode-javascript.js');
require('../../../bower_components/ace-builds/src-min-noconflict/theme-cobalt.js');
require('../../../bower_components/angular-ui-ace/ui-ace.js');
require('../../../bower_components/angular-scroll-glue/src/scrollglue.js');
require('../../../bower_components/jquery/dist/jquery.js');

//Factories/Providers/Services
require('./chat/chatFact.js');
require('./game/play/gamePlayFact.js');
require('./game/watch/gameWatchFact.js');
require('./lobby/lobbyFact.js');
require('./util/errorFact.js');
require('./util/socketFact.js');
require('./util/userFact.js');

//Controllers
require('./app.js');
require('./auth/authCtrl.js');
require('./chat/chatClientsCtrl.js');
require('./chat/chatCtrl.js');
require('./game/gameCtrl.js');
require('./game/play/gamePlayCtrl.js');
require('./game/watch/gameWatchCtrl.js');
require('./lobby/lobbyCtrl.js');
require('./login/loginCtrl.js');
require('./showError/showErrorCtrl.js');
require('./wrap/navBar/navBarCtrl.js');

angular.module('duel', [

  //Third-party
  'luegg.directives', //scroll-glue for sticky overflow
  'ui.ace', //ace editor
  'ui.bootstrap', //bootstrap
  'ui.router', //angular router

  //Controllers
  'duel.authCtrl', //Controller for 'auth' state
  'duel.chat.clientsCtrl', //Universal connected clients controller
  'duel.chatCtrl', //Universal chat controller
  'duel.gameCtrl', //Controller for 'game' state
  'duel.game.playCtrl', //Controller for 'game.play' state
  'duel.game.watchCtrl', //Controller for 'game.watch' state
  'duel.lobbyCtrl', //Controller for 'lobby' state
  'duel.loginCtrl', //Controller for 'login' state
  'duel.showErrorCtrl', //Controller for 'showError' state
  'duel.wrap.navBarCtrl', //Controller for 'navBar' state

  //Factories
  'duel.chatFact', //Factory for joining/leaving/messaging chat rooms
  'duel.errorFact', //Factory for handling errors
  'duel.game.watchFact', //Factory for spectating
  'duel.game.playFact', //Factory for gameplay
  'duel.lobbyFact', //Factory for creating/joining a game session
  'duel.socketFact', //Factory for creating socket connections
  'duel.userFact' //Factory for storing user session data
])

.run(['$rootScope', 'ChatFact', function($rootScope, ChatFact) {

  //Socket room router
  $rootScope.$on('$stateChangeSuccess',
    function(event, toState, toParams, fromState, fromParams, options) {
      var room;
      //leaving a state
      if (fromState.name === 'wrap.game.play' || fromState.name === 'wrap.game.watch') {
        room = fromParams.gameId;
        if (fromState === 'wrap.game.watch') room += '/watch';
        ChatFact.leaveRoom();
      }
      if (fromState.name === 'wrap.lobby') {
        ChatFact.leaveRoom();
      }

      //entering a state
      if (toState.name === 'wrap.game.play' || toState.name === 'wrap.game.watch') {
        room = toParams.gameId;
        if (toState.name === 'wrap.game.watch') room += '/watch';
        ChatFact.joinRoom(room);
      }
      if (toState.name === 'wrap.lobby') {
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
    .state('wrap', {
      abstract: true,
      views: {
        'duelNavBar@': {
          templateUrl: 'app/wrap/navBar/navBar.html',
          controller: 'NavBarCtrl'
        }
      }
    })

    .state('wrap.login', {
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

    .state('wrap.lobby', {
      url: '/lobby/:userName',
      views: {
        'duelContent@': {
          templateUrl: 'app/lobby/lobby.html',
          controller: 'LobbyCtrl'
        },
        'chat@wrap.lobby': {
          templateUrl: 'app/chat/views/lobby/lobbyChat.html',
          controller: 'ChatCtrl'
        },
        'users@wrap.lobby': {
          templateUrl: 'app/chat/views/lobby/lobbyClients.html',
          controller: 'ChatClientsCtrl'
        }
      }
    })

    .state('wrap.game', {
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

    .state('wrap.game.play', {
      params: {
        gameId: null
      },
      views: {
        'duelContent@': {
          templateUrl: 'app/game/play/gamePlay.html',
          controller: 'GamePlayCtrl'
        },
        'chat@wrap.game.play': {
          templateUrl: 'app/chat/views/dashboard/gameDashboardChat.html',
          controller: 'ChatCtrl'
        },
        'users@wrap.game.play': {
          templateUrl: 'app/chat/views/dashboard/gamePlayDashboardClients.html',
          controller: 'ChatClientsCtrl'
        }
      }
    })

    .state('wrap.game.watch', {
      params: {
        gameId: null
      },
      views: {
        'duelContent@': {
          templateUrl: 'app/game/watch/gameWatch.html',
          controller: 'GameWatchCtrl'
        },
        'chat@wrap.game.watch': {
          templateUrl: 'app/chat/views/dashboard/gameDashboardChat.html',
          controller: 'ChatCtrl'
        },
        'users@wrap.game.watch': {
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
