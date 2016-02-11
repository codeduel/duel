angular.module('duel.wrap.navBarCtrl', [])

.controller('NavBarCtrl', ['$rootScope','$scope', 'cssInjector', '$state', '$stateParams', 'UserFact', '$http', function($rootScope, $scope, cssInjector, $state, $stateParams, UserFact, $http) {
  
  $rootScope.changeTheme = function (theme){
  	var themes = ['molokai', 'solarized_dark', 'terminal', 'xcode', 'katzenmilch'];
    $rootScope.theme = theme;
    //Cobalt is the default theme in main.css
    if(theme === 'cobalt'){
      cssInjector.removeAll();
    }
    else{
      cssInjector.add('assets/css/' + theme + '.css');
    }
    //Removes any other themes we may add
    themes.forEach(function(x){
      if(x !== theme){
        cssInjector.remove('assets/css/' + x + '.css');
      }
    });
  };

}]);
