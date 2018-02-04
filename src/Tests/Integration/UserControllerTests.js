const chai = require('chai');
const chaiHttp = require('chai-http');
const httpStatus = require('http-status');
chai.use(chaiHttp);
const expect = chai.expect; // we are using the "expect" style of Chai

const MockConfigs = require('../assets/Configs');


describe('Basic User Tests - Create, List, Get, Delete', () => {

  let closure = {};

  it('Auth: Should be able to auth to get a JWT', function (done) {
    chai.request(MockConfigs.Url)
      .post('/v1/auth/login')
      .send({"email": "derp@derpmail.com", "password": "derp2"})
      .end(function (err, result) {
        expect(result).to.have.status(200);

        closure.tokenType = result.body.token.tokenType;
        closure.accessToken = result.body.token.accessToken;
        closure.refreshToken = result.body.token.refreshToken;
        closure.expiryToken = result.body.token.expiryToken;

        done();
      });
  });

  it('User.List: Should be able to list Users', function (done) {
    chai.request(MockConfigs.Url)
      .get('/v1/users')
      .set('Authorization',closure.tokenType + ' ' + closure.accessToken)
      .end(function (err, result) {
        expect(result).to.have.status(200);

        done();
      });
  });

  it('User.Create: Should be able to create a new user', function (done) {
    chai.request(MockConfigs.Url)
      .post('/v1/users')
      .set('Authorization',closure.tokenType + ' ' + closure.accessToken)
      .send({"email": "newUser@gmail.com", "password": "stuff", "role":"admin"})
      .end(function (err, result) {
        expect(result).to.have.status(httpStatus.OK);
        closure.CreatedUserId = result.body.id;
        done();
      });
  });

  it('User.Get: Should be able to Get the newly created a new user', function (done) {
    chai.request(MockConfigs.Url)
      .get('/v1/users/' + closure.CreatedUserId)
      .set('Authorization',closure.tokenType + ' ' + closure.accessToken)
      .end(function (err, result) {
        expect(result).to.have.status(httpStatus.OK);
        expect(result.body.email).to.have.email("newUser@gmail.com")
        closure.CreatedUserId = result.body.id;
        done();
      });
  });

  it('User.Create: Should NOT be able to create a new user with ID', function (done) {
    chai.request(MockConfigs.Url)
      .post('/v1/users')
      .set('Authorization',closure.tokenType + ' ' + closure.accessToken)
      .send({"id":closure.CreatedUserId, "email": "newUser@gmail.com", "password": "stuff", "role":"admin"})
      .end(function (err, result) {
        expect(result).to.have.status(httpStatus.UNAUTHORIZED);

        done();
      });
  });

  it('User.Create: Should NOT be able to create a new user with the same email', function (done) {
    chai.request(MockConfigs.Url)
      .post('/v1/users')
      .set('Authorization',closure.tokenType + ' ' + closure.accessToken)
      .send({"email": "newUser@gmail.com", "password": "stuff", "role":"admin"})
      .end(function (err, result) {
        expect(result).to.have.status(httpStatus.UNAUTHORIZED);

        done();
      });
  });

  it('User.Delete: Should be able to delete a user using the Id', function (done) {
    chai.request(MockConfigs.Url)
      .delete('/v1/users/' + closure.CreatedUserId)
      .set('Authorization',closure.tokenType + ' ' + closure.accessToken)

      .end(function (err, result) {
        expect(result).to.have.status(httpStatus.OK);

        done();
      });
  });

  it('User.Delete: Should NOT be able to delete a non existing user using the Id', function (done) {
    chai.request(MockConfigs.Url)
      .delete('/v1/users/' + closure.CreatedUserId)
      .set('Authorization',closure.tokenType + ' ' + closure.accessToken)

      .end(function (err, result) {
        expect(result).to.have.status(httpStatus.UNAUTHORIZED);

        done();
      });
  });

  it('User.Delete: Should fail if no Id provided', function (done) {
    chai.request(MockConfigs.Url)
      .delete('/v1/users/ ')
      .set('Authorization',closure.tokenType + ' ' + closure.accessToken)

      .end(function (err, result) {
        expect(result).to.have.status(httpStatus.BAD_REQUEST);

        done();
      });
  });
});

