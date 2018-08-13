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
        log: 'debug',
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
        user = new UserModel(result._source);
      }
    } catch (error) {
      // TODO: Figure out the how to log these
      // throw new ServiceException('User does not exist');
      console.log('can find user');
    }
    return user;
  }

  async listUsers() {
    console.log('\n\n\n-------User.List: Should be able to list Users -------------------------------------------------\n\n');
    const users = [];
    try {
      const result = await this.client.search({
        index: repository.usersIndex,
        type: 'docs',
      });

      const userResult = (((result || {}).hits || {}).hits || {});
      if (userResult !== {}) {
        userResult.forEach((usr) => {
          users.push(new UserModel(usr));
        });
      }
    } catch (error) {
      // TODO: Figure out the how to log these
      // throw new ServiceException('User does not exist');
      console.log('cant find user');
    }
    return users;
  }

  async saveUser(user) {
    console.log('\n\n\n-------Basic User Tests - Get -------------------------------------------------\n\n');
    const result = await this.client.index({
      refresh: 'wait_for',
      index: repository.usersIndex,
      type: 'docs',
      id: user.id,
      body: user,
    });

    if (result && result.result === 'created') {
      return user;
    }
    throw new ServiceException('User could not be created');
  }

  async isEmailDuplicate(userEmail) {
    let isEmailDuplicate = true;
    try {
      const result = await this.client.count({
        index: repository.usersIndex,
        type: 'docs',
        body: {
          query: {
            term: {
              email: userEmail,
            },
          },
        },
      });
      if (result.count !== undefined) {
        isEmailDuplicate = result.count >= 1;
      }
    } catch (error) {
      // TODO: Figure out the how to log these
      // throw new ServiceException('User does not exist');
      console.log('can find user');
    }
    return isEmailDuplicate;
  }

  async deleteUser(id) {
    let deleted = false;
    try {
      const result = await this.client.delete({
        index: repository.usersIndex,
        refresh: 'wait_for',
        type: 'docs',
        id,
      });
      if (result && result.result === 'deleted') {
        deleted = true;
      }
    } catch (error) {
      // TODO: Figure out the how to log these
      // throw new ServiceException('User does not exist');
    }
    return deleted;
  }
}

module.exports = ElasticRepo;
