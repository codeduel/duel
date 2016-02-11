angular.module('duel.wrap.navBarCtrl', [])

.controller('NavBarCtrl', ['$rootScope','$scope', 'cssInjector', '$state', '$stateParams', 'UserFact', '$http', function($rootScope, $scope, cssInjector, $state, $stateParams, UserFact, $http) {
  
  $scope.cobalt = function(){
    $rootScope.theme = 'cobalt';
    cssInjector.removeAll();
  };
  $scope.monokai = function(){
    $rootScope.theme = 'monokai';
    cssInjector.removeAll();
    cssInjector.add('assets/css/monokai.css');
  };
}]);
