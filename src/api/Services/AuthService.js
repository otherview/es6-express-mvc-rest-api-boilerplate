const ServiceException = require('../Models/Exceptions/ServiceException');
const UserService = require('../Services/UserService');
const TokenService = require('../Services/TokenService');


class AuthService {
  constructor() {
    this.userService = new UserService();
  }

  /**
         * Authenticates a user
         * @param authOptions
         * @returns {UserModel, Token}
         */
  async authUser(authOptions) {
    const { email, password, refreshObject } = authOptions;

    let userEmail = email;
    if (userEmail === undefined && refreshObject !== undefined) {
      userEmail = refreshObject.email;
    }

    if (userEmail === undefined) {
      throw new ServiceException({ message: 'User doens\'t have an enough credential to log in' });
    }

    const user = await this.userService.getUserByEmail(userEmail);
    if (user === undefined) {
      throw new ServiceException({ message: 'Not able to login' });
    }

    if (password && await user.passwordMatches(password)) {
      const token = TokenService.generateTokenResponse(user.token());
      return { user, token };
    }
    throw new ServiceException({ message: 'Not able to login' });
  }
}

module.exports = AuthService;
