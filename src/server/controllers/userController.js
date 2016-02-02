var User = require('../models/userModel.js').User;


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
  if (req.fromGitHub) {
    var name = req.body._json.name;
    var avatar_url = req.body._json.avatar_url;
    var login = req.body._json.login;
    var email = req.body._json.email;
    var location = req.body._json.location;
  }

  var query= User.findOne({
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
