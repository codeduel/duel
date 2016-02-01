angular.module('duel', [
  'ui.router',
  'ui.bootstrap',
  'duel.loginCtrl',
  'duel.lobbyCtrl',
  'duel.challengeCtrl',
  'duel.authCtrl',
  'duel.showErrorCtrl',
  'duel.errorFact',
  'duel.userFact'
])

.run(['$rootScope', function($rootScope) {

}])
//temporary controller until I can refactor ErrorFact as a provider
.controller('appController',['ErrorFact', function(ErrorFact){

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
        gameId: null
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
