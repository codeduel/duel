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
      'count-by-x',
      'stringy-strings',
      'convert-number-to-reversed-array-of-digits',
      'beginner-series-number-3-sum-of-numbers',
      'exes-and-ohs',
      'credit-card-mask',
      'the-coupon-code',
      'tricky-doubles',
      'sexy-primes-<3',
      'password-validator',
      'array-of-primes',
      'all-none-and-any',
      'binary-addition',
      'count-by-x'

    ],
    medium: [
      'jaden-casing-strings',
      'list-to-array',
      'remove-the-minimum',
      'unique-in-order',
      'longest-palindrome',
      'sum-of-pairs',
      'moving-zeros-to-the-end',
      'weird-string-case',
      'your-order-please',
      'find-the-divisors',
      'sum-consecutives'
    ],
    hard: [
      'snail',
      'sum-strings-as-numbers',
      'next-bigger-number-with-the-same-digits',
      'valid-braces',
      'pascals-triangle',
      'calculating-with-functions',
      'a-chain-adding-function',
      'guess-the-gifts',
      'valid-parentheses',
      'moving-zeros-to-the-end',
      'merged-string-checker'

    ],
    demo: [
      'multiply'
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
