var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//defines new user schema
var userSchema = new Schema({
  //just need user name since they will auth with github or password details
  userName: String,
  authMethods: {
    //set to true when auth method is added allowing for multiple auth types
    gitHubAuth: { type: Boolean, default: false },
    passwordAuth: { type: Boolean, default: false }
  },
  //get email in case we allow password resets
  passwordAuth: {
    email: String,
    password: String
  },
  //gitHubAuth properties match gitHub API's user attributes
  gitHubAuth: {
    login: String,
    name: String,
    email: String,
    location: String,
    avatar_url: String
  }
});


//create Schema
var User = mongoose.model('User', userSchema);

for(var i = 0; i < 10; i++){
  new User().save();
}

//export Schema
module.exports.User = User;
