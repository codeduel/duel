angular.module('duel.wrap.navBarCtrl', [])

.controller('NavBarCtrl', ['$scope', 'ThemeFact', function($scope, ThemeFact) {
  $scope.changeTheme = function(themeName){
      ThemeFact.setTheme(themeName);
  };
}]);
