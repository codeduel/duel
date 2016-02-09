angular.module('duel.showErrorCtrl', [])
.controller('ShowErrorCtrl', ['$scope', '$state', '$stateParams', '$timeout', 'ErrorFact', function($scope, $state, $stateParams, $timeout, ErrorFact) {
  $scope.errorType = $stateParams.errorType;
  $scope.errorData = $stateParams.errorData;
  $timeout(function(){
    $state.go('wrap.login');
  },3000);
}]);
