var rp = require('request-promise');
var querystring = require('querystring');

var config = {
  routes: {
    generateQuestion: function(language) {
      return 'https://www.codewars.com/api/v1/code-challenges/' + language + '/train';
    }
  },
  headers: {
    Authorization: 'kEkjFsC-diEykeESdmV7'
  },
  difficultyMappings: {
    easy: 'kyu_7_workout',
    medium: 'kyu_6_workout',
    hard: 'kyu_5_workout'
  }
}

exports.generateQuestion = function(difficulty) {
  var data = {
    strategy: config.difficultyMappings[difficulty], //difficulty of the question
    
    peek: false //peek at the question queue, without removing it from the queue
  }
  return query('POST', config.routes.generateQuestion('javascript'), data);
}

var query = function(method, uri, data, cb) {
  return rp({
    headers: config.headers,
    method: method,
    uri: uri,
    body: querystring.stringify(data)
  });
}
