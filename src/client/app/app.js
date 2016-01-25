angular.module('duel', [
  'ui.router',
  'duel.loginCtrl',
  'duel.lobbyCtrl',
  'duel.challengeCtrl'
])

.run(function() {

})

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

    .state('lobby', {
      url: '/lobby',
      params: {
        userid: 'Anonymous'
      },
      views: {
        'duelContent@': {
          templateUrl: 'app/lobby/lobby.html',
          controller: 'LobbyCtrl'
        }
      }
    })

    .state('challenge', {
      url: '/challenge',
      params: {
        gameid: null,
        userid: 'Anonymous'
      },
      views: {
        'duelContent@': {
          templateUrl: 'app/challenge/challenge.html',
          controller: 'ChallengeCtrl'
        }
      }
    })
}]);
