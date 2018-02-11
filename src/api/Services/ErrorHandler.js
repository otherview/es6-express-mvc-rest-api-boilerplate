const ServiceException = require('../Models/Exceptions/ServiceException');

const ErrorHandler = {
  handle(error) {
    if (error instanceof ServiceException) {
      console.log(error);
    }
    return 'derp';
  },
};

module.exports = ErrorHandler;
