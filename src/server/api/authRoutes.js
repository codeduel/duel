var express = require('express');
var router = express.Router();
var passport = require('passport');
var GithubStrategy = require('passport-github2').Strategy;
var userController = require('../controllers/userController.js');

router.get('/github',
  passport.authenticate('github', {
    scope: ['user', 'user:email']
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
          res.redirect('/#/auth/' + req.user.username);          
        }
        //user doesnt exist, create one
        else userController.createUser({body:req.user, fromGitHub:true}, res);
      })
  });

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

module.exports = router;