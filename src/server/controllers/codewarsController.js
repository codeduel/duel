var rp = require('request-promise');
var querystring = require('querystring');

/*
 *  Config object to hold all relevant API data
 */
var config = {
  //Routes object holding functions that will generate a URI based on the parameters given
  routes: {
    generateQuestion: function(language) {
      return 'https://www.codewars.com/api/v1/code-challenges/' + language + '/train';
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
    easy: 'kyu_7_workout',
    medium: 'kyu_6_workout',
    hard: 'kyu_5_workout'
  }
}

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
}

/*
 *  Queries the Code Wars API for a question
 */
exports.generateQuestion = function(difficulty) {
  var data = {
    strategy: config.difficultyMappings[difficulty], //difficulty of the question
    peek: false //peek at the question queue, without removing it from the queue
  }
  return query('POST', config.routes.generateQuestion('javascript'), data);
}

/*
 *  Submits a solution to the Code Wars API and returns a deferred message ID
 */
exports.submitSolution = function(solutionID, projectID, code) {
  var data = {
    code: code, //code of the potential solution
    output_format: 'html' //desired output - 'html' or 'raw'
  }
  return query('POST', config.routes.submitSolution(solutionID, projectID), data);
}

/*
 *  Queries the Code Wars API for the results of the specified dmid
 */
exports.getSolutionResults = function(dmid) {
  return query('GET', config.routes.getSolutionResults(dmid));
}