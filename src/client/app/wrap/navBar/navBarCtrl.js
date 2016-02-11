angular.module('duel.wrap.navBarCtrl', [])

.controller('NavBarCtrl', ['$rootScope','$scope', 'cssInjector', '$state', '$stateParams', 'UserFact', '$http', function($rootScope, $scope, cssInjector, $state, $stateParams, UserFact, $http) {
  
  $rootScope.changeTheme = function (theme){
  	var themes = ['molokai', 'solarized_dark', 'terminal', 'xcode', 'katzenmilch'];
    $rootScope.theme = theme;

    //If theme is Cobalt (default), remove all injected css files
    if(theme === 'cobalt'){
      cssInjector.removeAll();
    } else {
      //Inject a second css file, after main.css
      cssInjector.add('assets/css/' + theme + '.css');
    }

    //Remove any other css files that have been previously injected
    themes.forEach(function(x){
      if(x !== theme){
        cssInjector.remove('assets/css/' + x + '.css');
      }
    });
  };
}]);
