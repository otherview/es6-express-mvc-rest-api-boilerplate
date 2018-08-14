const AuthService = require('../Services/AuthService');

/**
 * Returns jwt token if valid username and password is provided
 * @public
 */
exports.login = async (req, res, next) => {
  try {
    const authService = new AuthService();
    const { user, token } = await authService.authUser(req.body);
    // const userService = new UserService();
    // const { user, accessToken } = await userService.findUserAndGenerateToken(req.body);
    // const token = TokenService.generateTokenResponse(accessToken);
    const userTransformed = user.transform();
    return res.json({ token, user: userTransformed });
  } catch (error) {
    return next(error);
  }
};

/**
 * Returns jwt token if registration was successful
 * @public
 */
// exports.register = async (req, res, next) => {
//   try {
//     const userService = new UserService();
//     const user = await (new User(req.body)).save();
//     const userTransformed = user.transform();
//     const token = generateTokenResponse(user, user.token());
//     res.status(httpStatus.CREATED);
//     return res.json({ token, user: userTransformed });
//   } catch (error) {
//     return next(User.checkDuplicateEmail(error));
//   }
// };
