var express = require('express');
var router = express.Router();
var passport = require('passport');
var GithubStrategy = require('passport-github2').Strategy;
var userController = require('../controllers/userController.js');
//Imports the Analytics library to pipe server side analytics
var Analytics = require('analytics-node');
var analytics = new Analytics('59YB1CrcYkdrsCsPWtFbpxPjeEe3SCJX', { flushAt: 1 });

router.get('/github',
  passport.authenticate('github', {
    scope: ['user:email']
  }),
  function(req, res) {
    // The request will be redirected to GitHub for authentication, so this
    // function will not be called.
  });

router.get('/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/#/login'
  }),
  function(req, res) {
    userController.userExists(req.user.username)
      .then(function(user) {
        console.log(req.user.displayName, ' logged in');
        //if user exists, send to client (auth controller)
        if (user) {
          //console.log(user);
          res.redirect('/#/auth/' + user._id + '/'+ user.userName);
        }
        //user doesnt exist, create one
        else userController.createUser({body:req.user, fromGitHub:true}, res);
      });

      //analytics identify
      analytics.identify({
        userId: req.user.username,
        traits: {
          name: req.user.displayName,
          email: req.user['_json']['email'],
          location: req.user['_json']['location'],
          githubFollowers: req.user['_json']['followers'],
          githubFollowing: req.user['_json']['following'],
          githubAcctCreated: req.user['_json']['created_at'],
          githubAcctUpdated: req.user['_json']['updated_at']
        }
      });
  });

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

module.exports = router;
