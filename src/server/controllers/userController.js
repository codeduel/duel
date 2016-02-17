var User = require('../models/userModel.js').User;
//Imports the Analytics library to pipe server side analytics
var Analytics = require('analytics-node');
var analytics = new Analytics('59YB1CrcYkdrsCsPWtFbpxPjeEe3SCJX', { flushAt: 1 });

exports.userExists = function (login) {
  return User.findOne({ 'gitHubAuth.login':  login });
};

exports.login = function (req, res) {
    var userId = req.body._id;
    User.findOne({ _id: userId  })
      .then(function(user){
        if (!user) res.sendStatus(401); // unauthorized: invalid credentials
        else res.status(200).json( {_id: user._id, name: user.gitHubAuth.name, login: user.gitHubAuth.login} ); // login successful
      })
      .catch(function(err){
        throw err;
      });
};


exports.createUser = function(req, res) {
  var name;
  var avatar_url;
  var login;
  var email;
  var location;

  if (req.fromGitHub) {
    name = req.body._json.name;
    avatar_url = req.body._json.avatar_url;
    login = req.body._json.login;
    email = req.body._json.email;
    location = req.body._json.location;
  }

  var query = User.findOne({
    'gitHubAuth.login': login
  });

  query.exec(function(err, user) {
    if (!user) {
      var newUser = new User({
        userName: login,
        gitHubAuth: {
          name: name,
          avatar_url: avatar_url,
          login: login,
          email: email,
          location: location
        },
        authMethods: {
          gitHubAuth: true
        }
      });
      newUser.save(function(err, newUser) {
        if (err) {
          console.log('error saving user');
          res.status(500).send(err);
        }
        res.redirect('/#/auth/' + newUser._id +'/'+ newUser.userName);
        
        analytics.track({
          userId: newUser.userName,
          event: 'Registered New User - server',
          properties: {
            name: newUser.gitHubAuth.name,
            avatar_url: newUser.gitHubAuth.avatar_url,
            login: newUser.gitHubAuth.login,
            email: newUser.gitHubAuth.email,
            location: newUser.gitHubAuth.location
          }
        });
      });
    } else {
      res.redirect('/#/auth/' + user._id +'/' + user.userName);
    }
  });
};

exports.findOne = function(req, res) {
  User.find({'gitHubAuth.login':  req.params.login
}).exec(function(err, profile) {
  res.json(profile);
});
};
