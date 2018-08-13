const chai = require('chai');
const chaiHttp = require('chai-http');
const httpStatus = require('http-status');
const MockConfigs = require('../assets/Configs');

const expect = chai.expect;
chai.use(chaiHttp);

describe('Basic User Tests - Create', () => {
  const closure = {};

  // Auth to get a JWT
  it('Auth user', (done) => {
    const user = { email: 'derp@derpmail.com', password: 'derp2' };

    chai.request(MockConfigs.Url)
      .post('/v1/auth/login')
      .send(user)
      .end((err, result) => {
        expect(result).to.have.status(200);

        closure.tokenType = result.body.token.tokenType;
        closure.accessToken = result.body.token.accessToken;
        closure.authToken = `${closure.tokenType} ${closure.accessToken}`;
        closure.expiryToken = result.body.token.expiresIn;

        done();
      });
  });

  it('User.Create: Should be able to create a new user', (done) => {
    const user = { email: 'newUser@gmail.com', password: 'stuff', role: 'admin' };
    chai.request(MockConfigs.Url)
      .post('/v1/users')
      .set('Authorization', closure.authToken)
      .send(user)
      .end((err, result) => {
        expect(result).to.have.status(httpStatus.OK);
        closure.CreatedUserId = result.body.id;
        done();
      });
  });

  it('User.Create: Should NOT be able to create a new user with ID', (done) => {
    chai.request(MockConfigs.Url)
      .post('/v1/users')
      .set('Authorization', closure.authToken)
      .send({
        id: closure.CreatedUserId, email: 'newUser@gmail.com', password: 'stuff', role: 'admin',
      })
      .end((err, result) => {
        expect(result).to.have.status(httpStatus.UNAUTHORIZED);

        done();
      });
  });

  it('User.Create: Should NOT be able to create a new user with the same email', (done) => {
    chai.request(MockConfigs.Url)
      .post('/v1/users')
      .set('Authorization', closure.authToken)
      .send({ email: 'newUser@gmail.com', password: 'stuff', role: 'admin' })
      .end((err, result) => {
        expect(result).to.have.status(httpStatus.UNAUTHORIZED);

        done();
      });
  });

  // Delete created User
  it('Delete user', (done) => {
    chai.request(MockConfigs.Url)
      .delete(`/v1/users/${closure.CreatedUserId}`)
      .set('Authorization', closure.authToken)
      .end((err, result) => {
        expect(result).to.have.status(httpStatus.OK);
        done();
      });
  });
});

describe('Basic User Tests - Get', () => {
  const closure = {};

  // Auth to get a JWT
  it('Auth user', (done) => {
    const authUser = { email: 'derp@derpmail.com', password: 'derp2' };

    chai.request(MockConfigs.Url)
      .post('/v1/auth/login')
      .send(authUser)
      .end((err, result) => {
        expect(result).to.have.status(200);

        closure.tokenType = result.body.token.tokenType;
        closure.accessToken = result.body.token.accessToken;
        closure.authToken = `${closure.tokenType} ${closure.accessToken}`;
        closure.expiryToken = result.body.token.expiryToken;

        done();
      });
  });

  it('Create User', (done) => {
    const newUser = { email: 'newUser@gmail.com', password: 'stuff', role: 'admin' };
    chai.request(MockConfigs.Url)
      .post('/v1/users')
      .set('Authorization', closure.authToken)
      .send(newUser)
      .end((err, result) => {
        expect(result).to.have.status(httpStatus.OK);
        closure.CreatedUserId = result.body.id;
        done();
      });
  });

  it('User.List: Should be able to list Users', (done) => {
    chai.request(MockConfigs.Url)
      .get('/v1/users')
      .set('Authorization', closure.authToken)
      .end((err, result) => {
        expect(result).to.have.status(200);

        done();
      });
  });

  it('User.Get: Should be able to Get a existing User', (done) => {
    const requestUrl = `/v1/users/${closure.CreatedUserId}`;
    chai.request(MockConfigs.Url)
      .get(requestUrl)
      .set('Authorization', closure.authToken)
      .end((err, result) => {
        expect(result).to.have.status(httpStatus.OK);
        expect(result.body.email).to.equal('newUser@gmail.com');
        closure.CreatedUserId = result.body.id;
        done();
      });
  });

  it('User.Get: Should NOT be able to Get a NON-existing User', (done) => {
    const requestUrl = `/v1/users/${closure.CreatedUserId}`;
    chai.request(MockConfigs.Url)
      .get(requestUrl)
      .set('Authorization', closure.authToken)
      .end((err, result) => {
        expect(result).to.have.status(httpStatus.OK);
        expect(result.body.email).to.equal('newUser@gmail.com');
        closure.CreatedUserId = result.body.id;
        done();
      });
  });

  // Delete created User
  it('Delete user', (done) => {
    chai.request(MockConfigs.Url)
      .delete(`/v1/users/${closure.CreatedUserId}`)
      .set('Authorization', closure.authToken)
      .end((err, result) => {
        expect(result).to.have.status(httpStatus.OK);
        done();
      });
  });
});

describe('Basic User Tests - Update', () => {
  const closure = {};

  it('Auth user', (done) => {
    const authUser = { email: 'derp@derpmail.com', password: 'derp2' };

    chai.request(MockConfigs.Url)
      .post('/v1/auth/login')
      .send(authUser)
      .end((err, result) => {
        expect(result).to.have.status(200);

        closure.tokenType = result.body.token.tokenType;
        closure.accessToken = result.body.token.accessToken;
        closure.authToken = `${closure.tokenType} ${closure.accessToken}`;
        closure.expiryToken = result.body.token.expiryToken;

        done();
      });
  });

  it('Create User', (done) => {
    const newUser = { email: 'newUser@gmail.com', password: 'stuff', role: 'admin' };
    chai.request(MockConfigs.Url)
      .post('/v1/users')
      .set('Authorization', closure.authToken)
      .send(newUser)
      .end((err, result) => {
        expect(result).to.have.status(httpStatus.OK);
        closure.CreatedUserId = result.body.id;
        done();
      });
  });

  it('User.Get: Should be able to Get a existing User', (done) => {
    const requestUrl = `/v1/users/${closure.CreatedUserId}`;
    chai.request(MockConfigs.Url)
      .get(requestUrl)
      .set('Authorization', closure.authToken)
      .end((err, result) => {
        expect(result).to.have.status(httpStatus.OK);
        expect(result.body.email).to.equal('newUser@gmail.com');
        closure.CreatedUserId = result.body.id;
        done();
      });
  });

  it('User.Update: Should be able to Update a existing User', (done) => {
    const requestUrl = `/v1/users/${closure.CreatedUserId}`;
    chai.request(MockConfigs.Url)
      .get(requestUrl)
      .set('Authorization', closure.authToken)
      .end((err, result) => {
        expect(result).to.have.status(httpStatus.OK);
        expect(result.body.email).to.equal('newUser@gmail.com');
        closure.CreatedUserId = result.body.id;
        done();
      });
  });

  it('User.Update: Should NOT be able to Update static fields of an existing User', (done) => {
    const requestUrl = `/v1/users/${closure.CreatedUserId}`;
    chai.request(MockConfigs.Url)
      .get(requestUrl)
      .set('Authorization', closure.authToken)
      .end((err, result) => {
        expect(result).to.have.status(httpStatus.OK);
        expect(result.body.email).to.equal('newUser@gmail.com');
        closure.CreatedUserId = result.body.id;
        done();
      });
  });

  it('User.Update: Should NOT be able to Update a NON-existing User', (done) => {
    const requestUrl = `/v1/users/${closure.CreatedUserId}`;
    chai.request(MockConfigs.Url)
      .get(requestUrl)
      .set('Authorization', closure.authToken)
      .end((err, result) => {
        expect(result).to.have.status(httpStatus.OK);
        expect(result.body.email).to.equal('newUser@gmail.com');
        closure.CreatedUserId = result.body.id;
        done();
      });
  });

  // Delete created User
  it('Delete user', (done) => {
    chai.request(MockConfigs.Url)
      .delete(`/v1/users/${closure.CreatedUserId}`)
      .set('Authorization', closure.authToken)
      .end((err, result) => {
        expect(result).to.have.status(httpStatus.OK);
        done();
      });
  });
});

describe('Basic User Tests - Delete', () => {
  const closure = {};

  it('Auth user', (done) => {
    const authUser = { email: 'derp@derpmail.com', password: 'derp2' };

    chai.request(MockConfigs.Url)
      .post('/v1/auth/login')
      .send(authUser)
      .end((err, result) => {
        expect(result).to.have.status(200);

        closure.tokenType = result.body.token.tokenType;
        closure.accessToken = result.body.token.accessToken;
        closure.authToken = `${closure.tokenType} ${closure.accessToken}`;
        closure.expiryToken = result.body.token.expiryToken;

        done();
      });
  });

  it('Create User', (done) => {
    const newUser = { email: 'newUser@gmail.com', password: 'stuff', role: 'admin' };
    chai.request(MockConfigs.Url)
      .post('/v1/users')
      .set('Authorization', closure.authToken)
      .send(newUser)
      .end((err, result) => {
        expect(result).to.have.status(httpStatus.OK);
        closure.CreatedUserId = result.body.id;
        done();
      });
  });

  it('User.Delete: Should be able to Delete an existing User', (done) => {
    const requestUrl = `/v1/users/${closure.CreatedUserId}`;
    chai.request(MockConfigs.Url)
      .delete(requestUrl)
      .set('Authorization', closure.authToken)
      .end((err, result) => {
        expect(result).to.have.status(httpStatus.OK);
        done();
      });
  });

  it('User.Delete: Should NOT be able to Delete a NON-existing User', (done) => {
    const requestUrl = `/v1/users/${closure.CreatedUserId}`;
    chai.request(MockConfigs.Url)
      .delete(requestUrl)
      .set('Authorization', closure.authToken)
      .end((err, result) => {
        expect(result).to.have.status(httpStatus.NOT_FOUND);
        done();
      });
  });
});

