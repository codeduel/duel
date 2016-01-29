var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//defines new game schema
var gameSchema = new Schema({
  gameId: {type: String, unique: true},
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
  timestamps: true,
});

//createSchema
var Game = mongoose.model('Game', gameSchema);

//hash for checking gameId during async save bursts
var currentGameIdHash = {};

//create the game id from a random number
var buildGameId = function(digits){
  //max at 16 digits
  if(digits > 16){
    digits = 16;
  }
  var randMultiple = Math.pow(10, digits);
  var zeros = (randMultiple + '').slice(1);
  //create random id with specified digits
  var randStamp = zeros + Math.floor(Math.random() * randMultiple);
  randStamp = randStamp.slice(randStamp.length - digits);
  //add a hyphen half way though
  if(digits > 1){
    var half = Math.floor(randStamp.length / 2);
    randStamp = randStamp.slice(0,half) + '-' + randStamp.slice(half);
  }
  return randStamp;
};

//pre hook inserts properly formatted gameId TODO: test possible refactor to init rather than save
gameSchema.pre('save', function(next){
  //default digits
  var digits = 7;
  var thisGame = this;
  //if we already have a gameId then run the next middleware and exit
  if(this.gameId){
    next();
    return;
  }
  //recurse until unique id is found
  var checkAndSetGameId = function(dbTryCount){
    dbTryCount = dbTryCount || 1;
    var hashTryCount = 0;
    var newGameId = buildGameId(digits);

    //if the game id is in use by another async, try again
    while(newGameId in currentGameIdHash){
      hashTryCount ++;
      newGameId = buildGameId(digits);
      //if we try 10 ids and they dont work, add a digit to make id longer
      if(hashTryCount % 2 === 0){
        digits ++;
      }
    }
    //save game id on hash
    currentGameIdHash[newGameId] = true;
    //check database for gameId and recurse if found
    Game.findOne({ gameId: newGameId }, function(error, data){
      if(error){
        console.log('error setting game id:', error);
      }
      //if there are no games with newGameId then we can set it on newGame!
      if(data === null){
        thisGame.gameId = newGameId;
        next();
      } else {
        //increase digits to help prevent collisions in case the database is getting full
        if(dbTryCount % 2 === 0){
          digits ++;
        }
        //remove gameId from hash since we aren't using it
        delete currentGameIdHash[newGameId];
        //try again and increase the try count
        checkAndSetGameId(dbTryCount + 1);
      }
    });
  };
  //run recursive function
  checkAndSetGameId();
});

//remove gameId from hash to reduce memory consumption after save has completed
gameSchema.post('save', function(doc){
  delete currentGameIdHash[doc.gameId];
});

module.exports.Game = Game;
