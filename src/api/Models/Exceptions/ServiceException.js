const httpStatus = require('http-status');

/**
 * @extends Error
 */
class ServiceException extends Error {
  constructor({ message, errors, isPublic }) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.status = httpStatus.UNAUTHORIZED;
    this.errors = errors;
    this.isPublic = isPublic;
  }
}


module.exports = ServiceException;
