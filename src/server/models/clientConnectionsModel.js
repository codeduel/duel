var ClientConnectionsModel = function() {
  this._connections = {};
}

//Adds a clientKey-clientValue pair inside a clientGroup
ClientConnectionsModel.prototype.add = function(clientGroup, clientKey, clientValue) {
  this._connections[clientGroup] = this._connections[clientGroup] || {};
  this._connections[clientGroup][clientKey] = clientValue;
}

//Removes a group or specific clientKey-clientValue pair inside a group
ClientConnectionsModel.prototype.remove = function(clientGroup, clientKey) {
  if(clientKey === undefined) {
    delete this._connections[clientGroup];
  } else {
    delete this._connections[clientGroup][clientKey];
  }
}

//Returns all the clients of a room
ClientConnectionsModel.prototype.getClients = function(clientGroup) {
  return this._connections[clientGroup];
}

module.exports = ClientConnectionsModel;