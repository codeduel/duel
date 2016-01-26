var express = require('express');
var router = express.Router();
var passport = require('passport');
var GithubStrategy = require('passport-github2').Strategy;

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
    res.redirect('/#/lobby');
  });

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

module.exports = router;