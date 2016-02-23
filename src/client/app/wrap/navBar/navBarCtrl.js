angular.module('duel.wrap.navBarCtrl', [])

.controller('NavBarCtrl', ['$scope', 'ThemeFact', 'UserFact', function($scope, ThemeFact, UserFact) {
  $scope.changeTheme = function(themeName){
      ThemeFact.setTheme(themeName);

      analytics.track('Changed Theme', {
        themeName: themeName
      });
  };

  $scope.userData = UserFact.data;


  $scope.logout = function() {
    UserFact.removeUser();
  };
}]);
