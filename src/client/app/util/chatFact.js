angular.module('duel.chatFact', ['duel.socketFact'])

.factory('ChatFact', ['UserFact', '$rootScope', 'SocketFact', function(UserFact, $rootScope, SocketFact) {
  var chatFact = {};

  chatFact.messages = [];
  chatFact.currRoom = {};

  //converts a string to a unique color hex code
  chatFact.nameToColor = function(str) {
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

  //****************
  //Socket Listeners
  //****************

  SocketFact.socket.on('chat/message', function(data) {
    chatFact.messages.push(data);
    console.log(data);
    $rootScope.$apply();
  });

  SocketFact.socket.on('chat/update', function(data) {
    chatFact.currRoom = data;
    $rootScope.$apply();
  })

  //***************
  //Socket Triggers
  //***************
  chatFact.joinRoom = function(room) {
    var msg = SocketFact.buildMessage({
      userId: UserFact.getUser().userId,
      room: room
    });
    SocketFact.socket.emit('chat/join', msg);
  }

  chatFact.sendMessage = function(text, room) {
    var userId = UserFact.getUser().userId;
    if (userId) {
      var msg = SocketFact.buildMessage({
        text: text,
        room: room,
        userId: userId
      });
      SocketFact.socket.emit('chat/message', msg);
    } else {
      chatFact.messages.push({
        userId: 'SYSTEM',
        text: 'Please login to chat!'
      });
    }

  }

  chatFact.leaveRoom = function(room) {
    var msg = SocketFact.buildMessage({
      userId: UserFact.getUser().userId,
      room: room
    });
    SocketFact.socket.emit('chat/leave', msg);
  }

  return chatFact;
}])

.directive('onEnter', function() {
  return function(scope, element, attrs) {
    element.bind("keydown keypress", function(event) {
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
});
