const chai = require('chai');
const chaiHttp = require('chai-http');
const MockConfigs = require('../assets/Configs');

chai.use(chaiHttp);
const expect = chai.expect; // we are using the "expect" style of Chai

describe('Basic Authentication tests', () => {

  let tokenType;
  let accessToken;
  let refreshToken;
  let expiryToken;
  let AuthHeader = {'Authorization':tokenType + ' ' + accessToken};

  it('Should be able to auth to get a JWT', function (done) {
    chai.request(MockConfigs.Url)
      .post('/v1/auth/login')
      .send({"email": "derp@derpmail.com", "password": "derp2"})
      .end(function (err, result) {
        expect(result).to.have.status(200);
        console.log(result.body);

        tokenType = result.tokenType;
        accessToken = result.accessToken;
        refreshToken = result.refreshToken;
        expiryToken = result.expiryToken;
        done();
      });
  });


});
