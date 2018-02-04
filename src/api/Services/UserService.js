const httpStatus = require('http-status');
const shortid = require('shortid');
const ServiceException = require('../Models/Exceptions/ServiceException');
const { UserModel } = require('../Models/UserModel');

const RepositoryFactoryService = require('./RepositoryFactoryService');
class UserService {
  constructor(){
    const repoFactory = new RepositoryFactoryService();
    this.repository = repoFactory.create();
  }

  /**
   * Gets User By Id
   * @param userId
   * @returns {UserModel}
   */
  async getUserById(userId){
    console.log("findById");
    return await this.repository.getUserById(userId);
  }

  /**
   * Lists Users
   * @returns {List<UserModel>}
   */
  async listUsers() {
    console.log("listUsers");
    return await this.repository.listUsers();
  };

  /**
   * Creates a new User
   * @param UserModel
   * @returns {UserModel}
   */
  async createUser(user) {

    // We control the ids
    if (user.id !== undefined){
      throw new ServiceException({message: "User as specified an Id."});
    }
    user.id = shortid.generate();

    // No Email dups
    if (await this.repository.isEmailDuplicate(user.email)){
      throw new ServiceException({message: "User already exists"});
    }

    return await this.repository.saveUser(user);
  };

  /**
   * Saves a userJson to DB
   * @param UserModel
   * @returns {UserModel}
   */
  async saveUser(user) {
    return await this.repository.saveUser(user);
  };

  /**
   * Deletes a User from the DB
   * @param userId
   */
  async deleteUserById(userId) {
    await this.repository.deleteUser(userId);
    return;
  };

  /**
   * Find user by email and tries to generate a JWT token
   *
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
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
};


module.exports = UserService;
