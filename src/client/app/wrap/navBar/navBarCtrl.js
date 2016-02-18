angular.module('duel.wrap.navBarCtrl', [])

.controller('NavBarCtrl', ['$scope', 'ThemeFact', 'UserFact', function($scope, ThemeFact, UserFact) {
  $scope.changeTheme = function(themeName){
      ThemeFact.setTheme(themeName);
  };

  $scope.login = function() {
    UserFact.loggedIn();
    return _data.loggedIn;
  };


  $scope.logout = function() {
    UserFact.removeUser();
  };
}]);
