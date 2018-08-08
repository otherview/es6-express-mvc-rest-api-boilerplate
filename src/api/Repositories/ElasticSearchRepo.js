const elastic = require('elasticsearch');
const { UserModel } = require('../Models/UserModel');
const ServiceException = require('../Models/Exceptions/ServiceException');
const { repository } = require('../../Configs/vars');


// We want a singleton ElasticSearch Repository
let instance = null;

class ElasticRepo {
  constructor() {
    if (!instance) {
      instance = this;
      instance.client = new elastic.Client({
        host: repository.uri,
        log: 'trace',
      });
    }
    return instance;
  }

  async getUserByEmail(email) {
    const user = await this.client.get({
      index: 'users',
      type: 'docs',
      id: email,
    });
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

module.exports = ElasticRepo;
