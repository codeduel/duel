angular.module('duel.showErrorCtrl', [])
.controller('ShowErrorCtrl', ['$scope', '$state', '$stateParams', function($scope, $state, $stateParams) {
  $scope.errorType = $stateParams.errorType;
  $scope.errorData = $stateParams.errorData;
}]);
