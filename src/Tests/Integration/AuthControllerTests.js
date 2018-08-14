const chai = require('chai');
const chaiHttp = require('chai-http');
const httpStatus = require('http-status');
const MockConfigs = require('../assets/Configs');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Basic Authentication tests', () => {
  it('Should be able to auth to get a JWT', (done) => {
    chai.request(MockConfigs.Url)
      .post('/v1/auth/login')
      .send({ email: 'derp@derpmail.com', password: 'derp2' })
      .end((err, result) => {
        expect(result).to.have.status(200);

        done();
      });
  });

  it('Should be NOT able to auth', (done) => {
    chai.request(MockConfigs.Url)
      .post('/v1/auth/login')
      .send({ email: 'derp@derpmail.com', password: 'derp' })
      .end((err, result) => {
        expect(result).to.have.status(httpStatus.UNAUTHORIZED);

        done();
      });
  });
});
