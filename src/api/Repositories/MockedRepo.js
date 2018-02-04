const bcrypt = require('bcryptjs');
const { UserModel } = require('../Models/UserModel');
const ServiceException = require('../Models/Exceptions/ServiceException');
const MockedData = [{'id':123, 'email':'derp@derpmail.com', 'password': bcrypt.hashSync('derp2'), 'role': 'admin'}];

class MockedRepo {
  async getUserByEmail ( email ) {
    const user = MockedData.find(function (element) {
      return element.email === email;
    });
    if (user){
      return new UserModel(user)
    }
    throw new ServiceException("User does not Exist");

  }
  async getUserById ( id ) {
    const user = MockedData.find(function (element) {
      return element.id === id;
    });
    if (user){
      return new UserModel(user)
    }
    throw new ServiceException("User does not Exist");
  }
  async listUsers () {
    const options = {'id':123, 'password': bcrypt.hashSync('derp2'), 'role': 'admin'};
    return MockedData.map( user => new UserModel(user));
  }

  async saveUser (user){
    MockedData.push(user);
    return user;
  }

  async isEmailDuplicate(userEmail){
    return  MockedData.some(function (el) {
      return el.email === userEmail;
    });
  }
  async userIdExists(id){
    return MockedData.some(function (el) {
      return el.id === id;
    });
  }

  async deleteUser(id){
    const index = MockedData.indexOf(MockedData.find(el => el.id === id));

    if (index === -1) {
      throw new ServiceException("User does not Exist");
    }
    MockedData.splice(index, 1);
    return;
  }
}

module.exports = MockedRepo;
