angular.module('duel', [
  //Third-party
  'ui.router', //angular router
  'ui.bootstrap', //bootstrap
  'ui.ace', //ace editor
  'luegg.directives', //scroll-glue
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
        templateUrl: 'app/lobby/lobbyChat.html',
        controller: 'ChatCtrl'
      },
      'users@lobby': {
        templateUrl: 'app/lobby/lobbyClients.html',
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
        templateUrl: 'app/game/watch/gameWatchChat.html',
        controller: 'ChatCtrl'
      },
      'users@game.watch': {
        templateUrl: 'app/game/watch/gameWatchClients.html',
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
