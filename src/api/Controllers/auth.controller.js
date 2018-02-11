const UserService = require('../Services/UserService');
const TokenService = require('../Services/TokenService');

/**
 * Returns jwt token if valid username and password is provided
 * @public
 */
exports.login = async (req, res, next) => {
  try {
    const userService = new UserService();
    const { user, accessToken } = await userService.findUserAndGenerateToken(req.body);
    const token = TokenService.generateTokenResponse(user, accessToken);
    const userTransformed = user.transform();
    return res.json({ token, user: userTransformed });
  } catch (error) {
    return next(error);
  }
};
