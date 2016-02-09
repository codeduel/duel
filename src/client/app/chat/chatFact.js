angular.module('duel.chatFact', [])

.factory('ChatFact', ['UserFact', '$rootScope', 'SocketFact', function(UserFact, $rootScope, SocketFact) {
  var chatFact = {};

  chatFact.messages = [];
  chatFact.clients = {};
  chatFact.currRoom = '';

  //converts a string to a unique color hex code
  chatFact.nameToColor = function(str) {
    if (str === 'SYSTEM') {
      return 'red';
    }

    if (str) {
      var hash = 0;
      for (var i = 0; i < str.length; i++) {
        hash = (hash << 5) + hash + str.charCodeAt(i);
        hash = hash & hash;
        hash = Math.abs(hash);
      }
      var hex = '#' + (hash % 16777215).toString(16);
      return hex;
    }
    return 'black';
  };

  //adds a message
  chatFact.add = function(msg) {
    chatFact.messages.push(msg);
  };

  //clears factory data
  chatFact.reset = function() {
    chatFact.messages = [];
    if (!UserFact.getUser().userId) {
      chatFact.messages.push({
        userId: 'SYSTEM',
        text: 'Hello guest. Please <a href="/#/login">login</a> to chat!',
        bold: true
      });
    }
    chatFact.clients = {};
  };

  //****************
  //Socket Listeners
  //****************

  SocketFact.socket.on('chat/message', function(data) {
    data.bold = data.bold || false;
    chatFact.messages.push(data);
    $rootScope.$apply();
  });

  SocketFact.socket.on('chat/update', function(data) {
    chatFact.clients = data;
    $rootScope.$apply();
  });

  //***************
  //Socket Triggers
  //***************
  chatFact.joinRoom = function(room) {
    var msg = SocketFact.buildMessage({
      userId: UserFact.getUser().userId,
      room: room
    });
    SocketFact.socket.emit('chat/join', msg);
    chatFact.currRoom = room;
  };

  chatFact.sendMessage = function(text) {
    var userId = UserFact.getUser().userId;
    if (userId) {
      var msg = SocketFact.buildMessage({
        text: text,
        room: chatFact.currRoom,
        userId: userId
      });
      SocketFact.socket.emit('chat/message', msg);
      analytics.track('Sent Chat', {
        userName: UserFact.getUser().userName,
        channel: chatFact.currRoom
      });
    } else {
      chatFact.messages.push({
        userId: 'SYSTEM',
        text: 'Please <a href="/#/login">login</a> to chat!',
        bold: true
      });
    }

  };

  chatFact.leaveRoom = function() {
    var msg = SocketFact.buildMessage({
      userId: UserFact.getUser().userId,
      room: chatFact.currRoom
    });
    SocketFact.socket.emit('chat/leave', msg);
  };

  return chatFact;
}])

.directive('onEnter', function() {
  return function(scope, element, attrs) {
    element.bind('keydown keypress', function(event) {
      if (event.which === 13) {
        scope.$apply(function() {
          scope.$eval(attrs.onEnter, {
            'event': event
          });
        });
        event.preventDefault();
      }
    });
  };
})

.filter('unsafe', function($sce) {
  return function(val) {
    return $sce.trustAsHtml(val);
  };
});
