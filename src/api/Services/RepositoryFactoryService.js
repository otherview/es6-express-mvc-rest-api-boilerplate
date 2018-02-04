const MockedRepo = require('../Repositories/MockedRepo');
const ElasticSearchRepo = require('../Repositories/ElasticSearchRepo');

// Define a skeleton Repository factory
class RepositoryFactoryService {};

// Define the prototypes and utilities for this factory

// Our default Repo is Mocked
RepositoryFactoryService.prototype.RepoClass = MockedRepo;

// Our Factory method for creating new Repo instances
RepositoryFactoryService.prototype.create = function ( options ) {

  switch(options){
    case "Mocked":
      this.RepoClass = MockedRepo;
      break;
    case "Elastic":
      this.RepoClass = ElasticSearchRepo;
      break;
  }

  return new this.RepoClass();

};

module.exports = RepositoryFactoryService;
