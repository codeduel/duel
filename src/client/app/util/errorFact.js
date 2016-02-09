angular.module('duel.errorFact', [])

.factory('ErrorFact', ['$state', '$window', 'SocketFact', 'UserFact', function($state, $window, SocketFact, UserFact) {
  //object to return from provider
  var errorFact = {};
  //private var for error handler mapping
  var _errorHandlerObj = {};

  //register error handlers
  errorFact.registerErrorHandler = function(errorType, errorFunction) {
    if (typeof errorType !== 'string' || typeof errorFunction !== 'function') {
      return;
    }
    if (errorType in _errorHandlerObj === false) {
      _errorHandlerObj[errorType] = [];
    }
    _errorHandlerObj[errorType].push(errorFunction);
  };

  //trigger errors. If there isn't an errorType or errorData, a generic handler is used
  errorFact.triggerError = function(errorType, errorData) {
    if (errorType in _errorHandlerObj) {
      //call each errorHandler and pass in errorData
      _errorHandlerObj[errorType].forEach(function(errorHander) {
        errorHander(errorData);
      });
    } else {
      //if there is no errorHander use default
      genericErrorHandler(errorType, errorData);
    }
  };

  //generic error handler that sends user to showError
  var genericErrorHandler = function(errorType, errorData) {
    //unregister user in case error is auth related TODO: replace with logout function
    UserFact.removeUser();
    $state.go('wrap.showError', {
      errorType: errorType,
      errorData: errorData
    });
  };

  //simple function to parse and trigger server socket error
  var triggerServerSocketError = function(socketErrorData) {
    errorFact.triggerError(socketErrorData.errorType, socketErrorData.errorData);
  };

  //for generic connection error types
  //user message gets displayed when generic error handler is used
  var triggerConnectionError = function() {
    errorFact.triggerError({
      errorType: 'connect_error',
      errorData: {
        userErrorMessage: 'Unfortunately something is wrong with your connection. Please try again.'
      }
    });
  };

  //send server errors to errorHandler
  SocketFact.socket.on('serverSocketError', triggerServerSocketError);

  //generic connection errors
  SocketFact.socket.on('connect_error', triggerConnectionError);
  SocketFact.socket.on('connect_timeout', triggerConnectionError);
  SocketFact.socket.on('reconnect_error', triggerConnectionError);
  SocketFact.socket.on('reconnect_failed', triggerConnectionError);

  return errorFact;
}]);
