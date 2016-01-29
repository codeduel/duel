angular.module('duel.userFact', [])

.factory('UserFact', ['$window', function($window) {
  var userFact = {};
  //data object is private to reduce errors through get/set and session restoration
  _data = {};
  _data.userName = undefined;
  _data.hasAuth = false;
  //gameRole will be spectator or player, default is spectator
  _data.gameRole = 'spectator';

  //set the userName
  userFact.setUserName = function(userName){
    if(userName !== undefined){
      _data.userName = userName;
      $window.localStorage.setItem('duel.userName', userName);
    }
  };

  //get the user in object form... allows for session restoration in the event of refresh
  //will refactor to use session tokens in local storage and ajax for restoration
  //will need to return a promise in the future since it's dependent on ajax
  userFact.getUser = function(){
    if(_data.userName !== undefined){
      return {userName: _data.userName};
    } else {
      _data.userName = $window.localStorage.getItem('duel.userName');
      return {userName: _data.userName};
    }
  };

  //should be called by any logout methods
  userFact.removeUser = function(){
    _data.userName = undefined;
    _data.hasAuth = false;
    _data.gameRole = 'spectator';
    $window.localStorage.removeItem('duel.userName');
  };

  return userFact;
}]);
