const chai = require('chai');
const chaiHttp = require('chai-http');
const httpStatus = require('http-status');
const MockConfigs = require('../assets/Configs');

const expect = chai.expect;
chai.use(chaiHttp);

describe('Basic User Tests - Create, List, Get, Delete', () => {
  const closure = {};

  it('Auth: Should be able to auth to get a JWT', (done) => {
    chai.request(MockConfigs.Url)
      .post('/v1/auth/login')
      .send({ email: 'derp@derpmail.com', password: 'derp2' })
      .end((err, result) => {
        expect(result).to.have.status(200);

        closure.tokenType = result.body.token.tokenType;
        closure.accessToken = result.body.token.accessToken;
        closure.authToken = `${closure.tokenType} ${closure.accessToken}`;
        closure.refreshToken = result.body.token.refreshToken;
        closure.expiryToken = result.body.token.expiryToken;

        done();
      });
  });

  it('User.List: Should be able to list Users', function (done) {
    chai.request(MockConfigs.Url)
      .get('/v1/users')
      .set('Authorization', closure.authToken)
      .end((err, result) => {
        expect(result).to.have.status(200);

        done();
      });
  });

  it('User.Create: Should be able to create a new user', function (done) {
    chai.request(MockConfigs.Url)
      .post('/v1/users')
      .set('Authorization', closure.authToken)
      .send({email: 'newUser@gmail.com', password: 'stuff', role:'admin'})
      .end(function (err, result) {
        expect(result).to.have.status(httpStatus.OK);
        closure.CreatedUserId = result.body.id;
        done();
      });
  });

  it('User.Get: Should be able to Get the newly created a new user', function (done) {
    const requestUrl = `/v1/users/${closure.CreatedUserId}`;
    chai.request(MockConfigs.Url)
      .get(requestUrl)
      .set('Authorization', closure.authToken)
      .end(function (err, result) {
        expect(result).to.have.status(httpStatus.OK);
        expect(result.body.email).to.have.email('newUser@gmail.com')
        closure.CreatedUserId = result.body.id;
        done();
      });
  });

  it('User.Create: Should NOT be able to create a new user with ID', function (done) {
    chai.request(MockConfigs.Url)
      .post('/v1/users')
      .set('Authorization', closure.authToken)
      .send({id: closure.CreatedUserId, email: 'newUser@gmail.com', password: 'stuff', role:'admin'})
      .end((err, result) => {
        expect(result).to.have.status(httpStatus.UNAUTHORIZED);

        done();
      });
  });

  it('User.Create: Should NOT be able to create a new user with the same email', function (done) {
    chai.request(MockConfigs.Url)
      .post('/v1/users')
      .set('Authorization', closure.authToken)
      .send({email: 'newUser@gmail.com', password: 'stuff', role:'admin'})
      .end((err, result) => {
        expect(result).to.have.status(httpStatus.UNAUTHORIZED);

        done();
      });
  });

  it('User.Delete: Should be able to delete a user using the Id', function (done) {
    const requestUrl = `/v1/users/${closure.CreatedUserId}`;

    chai.request(MockConfigs.Url)
      .delete(requestUrl)
      .set('Authorization', closure.authToken)
      .end((err, result) => {
        expect(result).to.have.status(httpStatus.OK);

        done();
      });
  });

  it('User.Delete: Should NOT be able to delete a non existing user using the Id', function (done) {
    const requestUrl = `/v1/users/${closure.CreatedUserId}`;

    chai.request(MockConfigs.Url)
      .delete(requestUrl)
      .set('Authorization', closure.authToken)
      .end((err, result) => {
        expect(result).to.have.status(httpStatus.UNAUTHORIZED);

        done();
      });
  });

  it('User.Delete: Should fail if no Id provided', function (done) {
    chai.request(MockConfigs.Url)
      .delete('/v1/users/ ')
      .set('Authorization', closure.authToken)

      .end((err, result) => {
        expect(result).to.have.status(httpStatus.BAD_REQUEST);

        done();
      });
  });
});

