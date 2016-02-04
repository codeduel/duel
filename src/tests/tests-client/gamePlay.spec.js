var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../../client/app.js');
var should = chai.should();

chai.use(chaiHttp);
describe('Blobs', function() {
  it('should list ALL blobs on /blobs GET')
});