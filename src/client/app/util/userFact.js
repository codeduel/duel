angular.module('duel.userFact', [])


//TODO refactor to use id's rather than fake them

.factory('UserFact', ['$window', function($window) {
  var userFact = {};
  userFact.data = {};
  userFact.data.userName = undefined;
  userFact.data.userId = undefined;
  userFact.data.hasAuth = false;
  //gameRole will be spectator or player, default is spectator
  userFact.data.gameRole = 'spectator';


  //checks a user to ensure all properties are set
  var checkUser = function(){
    //cleaner and easier to extend than a single long expression
    var userBool = true;
    userBool = userBool && userFact.data.userName;
    userBool = userBool && userFact.data.userId;
    userBool = userBool && userFact.data.hasAuth;
    userBool = userBool && userFact.data.gameRole;
    return userBool;
  };

  //checks auth specific user properties
  var checkAndSetUserAuth = function(){
    //cleaner and easier to extend than a single long expression
    var userAuthBool = true;
    userAuthBool = userAuthBool && userFact.data.userName;
    userAuthBool = userAuthBool && userFact.data.userId;
    //if all the correct properties are set, authorize the user
    if(userAuthBool){
      userFact.data.hasAuth = true;
    }
  };

  //regenerate user info from local storage
  //update later to pull from database based on session token
  var regenerateUser = function(){
    userFact.data.userName = $window.localStorage.getItem('duel.userName');
    userFact.data.userId = $window.localStorage.getItem('duel.userId');
    checkAndSetUserAuth();
  };

  //set the userName
  userFact.setUserName = function(userName){
    if(userName !== undefined){
      userFact.data.userName = userName;
      $window.localStorage.setItem('duel.userName', userName);

      //TODO: REMOVE THIS AFTER REFACTOR - temporary fix until userName and userId is implemented in chat
      userFact.data.userId = userName;
      $window.localStorage.setItem('duel.userId', userName);
    }
    checkAndSetUserAuth();
  };

  // //set the userId
  // userFact.setUserId = function(userId){
  //   if(userId !== undefined){
  //     userFact.data.userId = userId;
  //     $window.localStorage.setItem('duel.userId', userId);
  //   }
  //   checkAndSetUserAuth();
  // };

  //get the user in object form... allows for session restoration in the event of refresh
  //refactor to use session tokens in local storage and ajax for restoration
  //will need to return a promise in the future since it's dependent on ajax
  userFact.getUser = function(){
    if(checkUser()){
      return userFact.data;
    } else {
      regenerateUser();
      return userFact.data;
    }
  };

  //should be called by any logout methods
  userFact.removeUser = function(){
    $window.localStorage.removeItem('duel.userName');
    $window.localStorage.removeItem('duel.userId');
    userFact.data.userName = undefined;
    userFact.data.userId= undefined;
    userFact.data.hasAuth = false;
    userFact.data.gameRole = 'spectator';
  };

  return userFact;
}]);
