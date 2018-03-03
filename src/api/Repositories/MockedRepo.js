const bcrypt = require('bcryptjs');
const { UserModel } = require('../Models/UserModel');
const ServiceException = require('../Models/Exceptions/ServiceException');

// We want a singleton Mocked Repository
let instance = null;

class MockedRepo {
  constructor() {
    if (!instance) {
      instance = this;
    }
    this.MockedData = [{
      id: 123, email: 'derp@derpmail.com', password: bcrypt.hashSync('derp2'), role: 'admin',
    }];
    return instance;
  }

  async getUserByEmail(email) {
    const user = this.MockedData.find(element => element.email === email);
    if (user) {
      return new UserModel(user);
    }
    throw new ServiceException('User does not Exist');
  }

  async getUserById(id) {
    const user = this.MockedData.find(element => element.id === id);
    if (user) {
      return new UserModel(user);
    }
    return undefined;
    // throw new ServiceException('User does not Exist');
  }

  async listUsers() {
    return this.MockedData.map(user => new UserModel(user));
  }

  async saveUser(user) {
    this.MockedData.push(user);
    return user;
  }

  async isEmailDuplicate(userEmail) {
    return this.MockedData.some(el => el.email === userEmail);
  }

  async deleteUser(id) {
    const index = this.MockedData.indexOf(this.MockedData.find(el => el.id === id));

    if (index === -1) {
      return undefined;
    }
    this.MockedData.splice(index, 1);
    return true;
  }
}

module.exports = MockedRepo;
