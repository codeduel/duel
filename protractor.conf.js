exports.config = {

  seleniumAddress: 'http://localhost:4444/wd/hub',

  framework: 'jasmine',

  capabilities: {
    'browserName': 'chrome'
  },

  specs: ['test/e2e/**/*.js'],

  baseUrl: 'http://localhost:3000/',

  jasmineNodeOpts: {
  	showColors: true,
  	defaultTimeoutInterval: 20000,
  	isVerbose: true,
  	includeStrackTrace: true
  }

};