var rp = require('request-promise');
var querystring = require('querystring');

/*
 *  Config object to hold all relevant API data
 */
var config = {
  //Routes object holding functions that will generate a URI based on the parameters given
  routes: {
    generateQuestion: function(challenge, language) {
      return 'https://www.codewars.com/api/v1/code-challenges/' + challenge + '/' + language + '/train';
    },
    submitSolution: function(solutionID, projectID) {
      return 'https://www.codewars.com/api/v1/code-challenges/projects/' + projectID + '/solutions/' + solutionID + '/attempt';
    },
    getSolutionResults: function(dmid) {
      return 'https://www.codewars.com/api/v1/deferred/' + dmid;
    }
  },

  //Headers object for all queries
  headers: {
    Authorization: 'kEkjFsC-diEykeESdmV7'
  },

  //Dictionary object that maps front-end descriptions to API-specific strings as key-value pairs (respectively)
  difficultyMappings: {
    easy: [
      'count-by-x',                   //js, ruby, python, haskell
      'stringy-strings',              //js, ruby, python, haskell, cofeescript, C#, java
      'convert-number-to-reversed-array-of-digits',  //js, ruby, python, haskell, coffeescript, clojure
      'beginner-series-number-3-sum-of-numbers',     //js, ruby, python, cofeescript, C#, java
      'exes-and-ohs',                 //js, ruby, python, haskell, cofeescript
      'credit-card-mask',             //js, ruby, python, haskell, cofeescript, C#
      'binary-addition',              //js, ruby, python
      'broken-greetings',             //js, ruby, python, haskell, cofeescript, C#, clojure, java
      'divisible-by-four',            //js, ruby, python, C#
      'unexpected-parsing',           //js, ruby, python
      'stringy-strings',              //js, ruby, python, haskell, cofeescript, C#, java
      'sum-arrays',                   //js, ruby, python, haskell, cofeescript, clojure
      'convert-a-string-to-a-number', //js, ruby, python, haskell, cofeescript, C#, java, clojure
      'count-by-x'                    //js, ruby, python, haskell
      // 'the-coupon-code',             //js, C#
      // 'tricky-doubles',              //js, ruby
      // 'sexy-primes-<3',              //js, python, C#
      // 'password-validator',          //js
      // 'array-of-primes',             //js -> this problem is too dificult for beginers 
      // 'all-none-and-any',            //js, haskell

    ],
    medium: [
      'jaden-casing-strings',           //js, ruby, python, haskell, coffeescript, java, clojure
      'is-n-divisible-by-dot-dot-dot',  //js, ruby, python, haskell
      'remove-the-minimum',             //js, ruby, python, haskell, cofeescript, C#
      'unique-in-order',                //js, ruby, python
      'longest-palindrome',             //js, ruby, python
      'sum-of-pairs',                   //js, ruby, python
      'weird-string-case',              //js, ruby, python, haskell, coffeescript
      'find-the-divisors',              //js, ruby, python, haskell, coffeescript
      'x-marks-the-spot',               //js, ruby, python
      'sum-consecutives'                //js, ruby, python, haskell, coffeescript, clojure, java
      // 'your-order-please',              //js, python, java
      // 'list-to-array',                  //js, python
      // 'moving-zeros-to-the-end',        //js, cofeescript
    ],
    hard: [
      'snail',                         //js, ruby, python, haskell, coffeescript
      'next-bigger-number-with-the-same-digits', //js, ruby, python, C#
      'convert-string-to-camel-case',  //js, python, ruby, haskell, coffeescript,  C#
      'valid-braces',                  //js, python, haskell, coffeescript, java
      'valid-parentheses',             //js, ruby, python, haskell, coffeescript
      'first-n-prime-numbers',         //js, ruby, python
      'last-digit-of-a-large-number',  //js, ruby, python, haskell
      'feynmans-square-question',      //js, ruby, python, haskell
      'did-i-finish-my-sudoku'         //js, ruby, python
      // 'sum-strings-as-numbers',        //js, C#
      // 'pascals-triangle',              //js, ruby, coffeescript, C#, haskell
      // 'calculating-with-functions',    //js, ruby
      // 'a-chain-adding-function',       //js
      // 'guess-the-gifts',               //js, ruby, coffeescript
      // 'moving-zeros-to-the-end',       //js, coffeescript
      // 'merged-string-checker'          //js, python, haskell, coffeescript, clojure, java, C#

    ],
    demo: [
      'multiply' //js, ruby, python, haskell, coffeescript, clojure, java, C#
    ]
  }
};


//Returns a random pre-defined question 'slug' of the specified difficulty
var getRandomChallenge = function(difficulty) {
  return config.difficultyMappings[difficulty][Math.floor(config.difficultyMappings[difficulty].length * Math.random())];
};

/*
 *  Generic query builder, returns a promise
 */
var query = function(method, uri, data) {
  return rp({
    headers: config.headers,
    method: method,
    uri: uri,
    json: data
  });
};

/*
 *  Queries the Code Wars API for a question
 */
exports.generateQuestion = function(difficulty) {
  if (difficulty in config.difficultyMappings) {
    var challenge = getRandomChallenge(difficulty);
    return query('POST', config.routes.generateQuestion(challenge, 'javascript'), {});
  }
};

/*
 *  Submits a solution to the Code Wars API and returns a deferred message ID
 */
exports.submitSolution = function(solutionID, projectID, code) {
  var data = {
    code: code, //code of the potential solution
    output_format: 'html' //desired output - 'html' or 'raw'
  };
  return query('POST', config.routes.submitSolution(solutionID, projectID), data);
};

/*
 *  Queries the Code Wars API for the results of the specified dmid
 */
exports.getSolutionResults = function(dmid) {
  return query('GET', config.routes.getSolutionResults(dmid), {});
};
