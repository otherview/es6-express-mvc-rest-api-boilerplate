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
    const result = await this.client.search({
      index: repository.usersIndex,
      type: 'docs',
      filterPath: ['hits.hits._source'],
      body: {
        query: {
          term: {
            email,
          },
        },
      },
    });

    const user = (((((result || {}).hits || {}).hits || {})[0] || {})._source || {});
    if (user !== {}) {
      return new UserModel(user);
    }
    throw new ServiceException('User does not Exist');
  }

  async getUserById(id) {
    let user;
    try {
      const result = await this.client.get({
        index: repository.usersIndex,
        type: 'docs',
        id,
      });
      if (result._source) {
        user = UserModel(result._source);
      }
    } catch (error) {
      // TODO: Figure out the how to log these
      // throw new ServiceException('User does not exist');
    }
    return user;
  }

  async listUsers() {
    return this.MockedData.map(user => new UserModel(user));
  }

  async saveUser(user) {
    const result = await this.client.index({
      index: repository.usersIndex,
      type: 'docs',
      body: user,
    });

    const userResult = (((((result || {}).hits || {}).hits || {})[0] || {})._source || {});
    if (userResult !== {}) {
      return user;
    }
    throw new ServiceException('User could not be created');
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
