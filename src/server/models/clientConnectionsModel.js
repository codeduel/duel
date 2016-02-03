var clientConnections = {};

//Adds a clientKey-clientValue pair inside a clientGroup
exports.add = function(clientGroup, clientKey, clientValue) {
  clientConnections[clientGroup] = clientConnections[clientGroup] || {};
  clientConnections[clientGroup][clientKey] = clientValue;
}

//Removes a group or specific clientKey-clientValue pair inside a group
exports.remove = function(clientGroup, clientKey) {
  if(clientKey === undefined) {
    delete clientConnections[clientGroup];
  } else {
    delete clientConnections[clientGroup][clientKey];
  }
}

//Returns all the clientConnections of a room
exports.getClients = function(clientGroup) {
  return clientConnections[clientGroup];
}