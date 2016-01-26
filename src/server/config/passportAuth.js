// github auth
var passport = require('passport');
var GithubStrategy = require('passport-github2').Strategy;
var credentials = require('./credentials.js')

module.exports = function (app){

// Passport session setup
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(obj, done) {
        done(null, obj);
    });

    passport.use(new GithubStrategy({
            clientID: credentials.GITHUB_CLIENT_ID,
            clientSecret:credentials.GITHUB_CLIENT_SECRET,
            callbackURL: credentials.GITHUB_CALLBACK_URL
        },
        function(accessToken, refreshToken, profile, done) {
            process.nextTick(function() {
                return done(null, profile);
            });
        }
    ));

    app.use(passport.initialize());
    app.use(passport.session()); //persistent login session

}
