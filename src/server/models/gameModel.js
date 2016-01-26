var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//defines new game schema
var gameSchema = new Schema({
  gameId: String,
  players: [String], //TODO: refactor to ObjectId when player schema is created
  active: Boolean,
  spectators: [String], //TODO: implement spectators via ObjectId
  question: String,
  initialCode: String,
  projectId: String,
  solutionId: String,
  rank: Number
},
{
  //mongoose option that adds createdAt and updatedAt fields
  timestamps: true
});

//createSchema
var Game = mongoose.model('Game', gameSchema);


//pre hook inserts properly formatted gameId
gameSchema.pre('init', function(next){
  var checkAndSetGameId = function(){

  };
});



var buildGameId = function(digits){
  if(digits > 16){
    digits = 16;
  }
  var randMultiple = Math.pow(10, digits);
  var zeros = (randMultiple + '').slice(1);
  //makes collisions less likely via random and time
  var startStamp = zeros + Math.floor(Math.random() * randMultiple);
  startStamp = startStamp.slice(startStamp.length - digits);
  //returns current second in ms
  var endStamp = Date.now() + '';
  endStamp = endStamp.slice(endStamp.length - 4);
  return startStamp + '-' + endStamp;
};
