angular.module('duel', [
  'ui.router',
  'ui.bootstrap',
  'duel.loginCtrl',
  'duel.lobbyCtrl',
  'duel.gameCtrl',
  'duel.authCtrl',
  'duel.showErrorCtrl',
  'duel.errorFact',
  'duel.userFact'
])

.run(['$rootScope', 'ChatFact', function($rootScope, ChatFact) {

  //Socket room router
  $rootScope.$on('$stateChangeSuccess',
    function(event, toState, toParams, fromState, fromParams, options) {

      //leaving game.play or game.watch state
      if (fromState.name === 'game.play' || fromState.name === 'game.watch') {
        var room = fromParams.gameId;
        if (fromState === 'game.watch') room += '/watch';
        ChatFact.leaveRoom(room);
      }

      //entering game.play or game.watch state
      if (toState.name === 'game.play' || toState.name === 'game.watch') {
        var room = toParams.gameId;
        if (toState.name === 'game.watch') room += '/watch';
        ChatFact.joinRoom(room);
      }

      //user should always be in lobby room unless logged out
      if(toState.name !== 'login') {
        ChatFact.joinRoom('lobby');
      }
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
        templateUrl: 'app/lobby/chat/lobbyChat.html',
        controller: 'LobbyChatCtrl'
      },
      'users@lobby': {
        templateUrl: 'app/lobby/users/lobbyUsers.html',
        controller: 'LobbyUsersCtrl'
      },
      'games@lobby': {
        templateUrl: 'app/lobby/games/lobbyGames.html',
        controller: 'LobbyGamesCtrl'
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
        templateUrl: 'app/game/watch/chat/gameWatchChat.html',
        controller: 'GameWatchChatCtrl'
      },
      'users@game.watch': {
        templateUrl: 'app/game/watch/users/gameWatchUsers.html',
        controller: 'GameWatchUsersCtrl'
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
