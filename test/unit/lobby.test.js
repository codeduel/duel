describe('Lobby Controller', function() {
  
  beforeEach(module('duel.lobbyCtrl'));

  var $controller, $httpBackend;

  //establish basic ionjectons before each test
  beforeEach(inject(function(_$rootScope_, _$controller_, _$httpBackend_){
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    $controller = _$controller_;
  }));
  
  describe('currentView', function(){
  	it('should be set to null to start', function(){
  	  var $state = {};
  	  var LobbyFact = {};
  	  var UserFact = {};
  	  var ChatFact = {};
  	  var controller = $controller('LobbyCtrl', {$scope: $scope, $state: $state, LobbyFact: LobbyFact, UserFact: UserFact});
  	  expect($scope.currentView).toEqual(null);
  	});
  });
});