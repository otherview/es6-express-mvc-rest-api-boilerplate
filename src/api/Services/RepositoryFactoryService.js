const MockedRepo = require('../Repositories/MockedRepo');
const ElasticSearchRepo = require('../Repositories/ElasticSearchRepo');

// Define a skeleton Repository factory
class RepositoryFactoryService {
  constructor() {
    // Our default Repo is Mocked
    this.RepoClass = MockedRepo;
  }

  // Our Factory method for creating new Repo instances
  create(options) {
    switch (options) {
      case 'Mocked':
        this.RepoClass = MockedRepo;
        break;
      case 'Elastic':
        this.RepoClass = ElasticSearchRepo;
        break;
      default:
        break;
    }

    return new this.RepoClass();
  }
}

module.exports = RepositoryFactoryService;
