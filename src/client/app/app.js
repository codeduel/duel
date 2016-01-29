angular.module('duel', [
  'ui.router',
  'duel.loginCtrl',
  'duel.lobbyCtrl',
  'duel.challengeCtrl',
  'duel.authCtrl',
  'duel.showErrorCtrl',
  'duel.errorProv'
])

.run(function() {

})

.config(['$stateProvider', '$urlRouterProvider', 'ErrorProvProvider', function($stateProvider, $urlRouterProvider, ErrorProvProvider) {
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
      url: '/auth/:userID',  // Server routes back here after authenticating with GitHub
      views: {
        'duelContent@': {
          templateUrl: 'app/login/login.html',
          controller: 'AuthCtrl'
        }
      }
    })

    .state('lobby', {
      url: '/lobby',
      params: {
        userId: 'Anonymous'
      },
      views: {
        'duelContent@': {
          templateUrl: 'app/lobby/lobby.html',
          controller: 'LobbyCtrl'
        }
      }
    })

    .state('challenge', {
      url: '/game/:gameId',
      params: {
        gameId: null,
        userId: 'Anonymous'
      },
      views: {
        'duelContent@': {
          templateUrl: 'app/challenge/challenge.html',
          controller: 'ChallengeCtrl'
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
