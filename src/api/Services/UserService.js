const httpStatus = require('http-status');
const shortid = require('shortid');
const ServiceException = require('../Models/Exceptions/ServiceException');
const RepositoryFactoryService = require('./RepositoryFactoryService');
const APIError = require('../Helpers/APIError');
const ErrorHandler = require('./ErrorHandler');

class UserService {
  constructor(_loggedInUser) {
    const repoFactory = new RepositoryFactoryService();
    this.repository = repoFactory.create();
    this._loggedInUser = _loggedInUser;
  }

  /**
   * Gets User By Id
   * @param userId
   * @returns {UserModel}
   */
  async getUserById(userId) {
    try {
      const user = await this.repository.getUserById(userId);
      if (user) {
        return user;
      }
      return undefined;
    } catch (error) {
      return ErrorHandler.handle(error);
    }
  }

  /**
   * Gets User By Email
   * @param email
   * @returns {UserModel}
   */
  async getUserByEmail(email) {
    try {
      const user = await this.repository.getUserByEmail(email);
      if (user) {
        return user;
      }
      return undefined;
    } catch (error) {
      return ErrorHandler.handle(error);
    }
  }

  /**
   * Lists Users
   * @returns {List<UserModel>}
   */
  async listUsers() {
    return this.repository.listUsers();
  }

  /**
   * Creates a new User
   * @returns {UserModel}
   * @param user
   */
  async createUser(user) {
    const createUser = user;

    // We control the ids
    if (createUser.id !== undefined) {
      throw new ServiceException({ message: 'User as specified an Id.' });
    }
    createUser.id = shortid.generate();

    // No Email duplicates
    if (await this.repository.isEmailDuplicate(createUser.email)) {
      throw new ServiceException({ message: 'User already exists' });
    }

    return this.repository.saveUser(createUser);
  }

  /**
   * Updates existing new User
   * @returns {UserModel}
   * @param user
   */
  async updateUser(user) {
    const createUser = user;

    // Must have Id and must exist
    if (createUser.id === undefined) {
      throw new ServiceException({ message: 'User has no Id.' });
    }

    const existingUser = this.repository.getUserById(user.id);

    if (existingUser === undefined || existingUser.status === 'deleted') {
      throw new ServiceException({ message: 'User is funky.' });
    }

    // Must have the same email and Id
    if (existingUser.email !== this._loggedInUser.email
    && existingUser.id !== this._loggedInUser.id) {
      throw new ServiceException({ message: 'Existing and logged User dont match' });
    }

    return this.repository.saveUser(createUser);
  }


  /**
   * Saves a userJson to DB
   * @returns {UserModel}
   * @param user
   */
  async saveUser(user) {
    return this.repository.saveUser(user);
  }

  /**
   * Deletes a User from the DB
   * @param userId
   */
  async deleteUserById(userId) {
    return this.repository.deleteUser(userId);
  }

  /**
   * Find user by email and tries to generate a JWT token
   *
   * @returns {Promise<User, APIError>}
   * @param options
   */
  async findUserAndGenerateToken(options) {
    const { email, password, refreshObject } = options;
    if (!email) throw new APIError({ message: 'An email is required to generate a token' });

    const user = await this.repository.getUserByEmail(email);
    const err = {
      status: httpStatus.UNAUTHORIZED,
      isPublic: true,
    };
    if (password) {
      if (user && await user.passwordMatches(password)) {
        return { user, accessToken: user.token() };
      }
      err.message = 'Incorrect email or password';
    } else if (refreshObject && refreshObject.userEmail === email) {
      return { user, accessToken: user.token() };
    } else {
      err.message = 'Incorrect email or refreshToken';
    }
    throw new APIError(err);
  }
}


module.exports = UserService;
