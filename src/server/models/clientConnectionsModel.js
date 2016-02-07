var clientConnections = {};


//Adds a clientKey-clientValue pair inside a clientGroup
exports.addGroup = function(clientGroup) {
  if(clientGroup in clientConnections === false){
    clientConnections[clientGroup] = {};
  }
};

//Adds a clientKey-clientValue pair inside a clientGroup
exports.add = function(clientGroup, clientKey, clientValue) {
  clientConnections[clientGroup] = clientConnections[clientGroup] || {};
  clientConnections[clientGroup][clientKey] = clientValue;
};

//Removes a group or specific clientKey-clientValue pair inside a group
exports.remove = function(clientGroup, clientKey) {
  if(!clientKey) {
    delete clientConnections[clientGroup];
  } else {
    delete clientConnections[clientGroup][clientKey];
  }
};

//Returns all the clientConnections of a room
exports.getClients = function(clientGroup) {
  return clientConnections[clientGroup];
};

//Returns all the clientConnections of a room in array format
exports.getClientsArray = function(clientGroup) {
  if(clientGroup in clientConnections) {
    return Object.keys(clientConnections[clientGroup]);
  } else {
    return [];
  }
};

//Returns a single client's information
exports.getClient = function(clientGroup, clientKey) {
  return clientConnections[clientGroup][clientKey];
};
