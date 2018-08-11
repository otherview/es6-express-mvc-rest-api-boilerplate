const MockedRepo = require('../Repositories/MockedRepo');
const ElasticSearchRepo = require('../Repositories/ElasticSearchRepo');
const { env } = require('../../Configs/vars');


// Define a skeleton Repository factory
class RepositoryFactoryService {
  constructor() {
    // Our default Repo is Mocked
    this.RepoClass = MockedRepo;
  }

  // Our Factory method for creating new Repo instances
  create() {
    switch (env) {
      case 'test':
        this.RepoClass = MockedRepo;
        break;
      case 'staging':
      case 'prod':
        this.RepoClass = ElasticSearchRepo;
        break;
      default:
        break;
    }

    return new this.RepoClass();
  }
}

module.exports = RepositoryFactoryService;
