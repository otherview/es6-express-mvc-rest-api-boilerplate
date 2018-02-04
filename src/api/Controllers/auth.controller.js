const httpStatus = require('http-status');
const UserService = require('../Services/UserService');
const UserModel = require('../Models/UserModel');
const TokenService = require('../Services/TokenService');

const moment = require('moment-timezone');
const { jwtExpirationInterval } = require('../../Configs/vars');


/**
 * Returns jwt token if registration was successful
 * @public
 */
exports.register = async (req, res, next) => {
  try {
    const userService = new UserService();

    const user = new UserModel(req.body);

    userService.saveUser(user);

    const token = TokenService.generateTokenResponse(user, user.token());
    res.status(httpStatus.CREATED);
    return res.json({ token, user: user.transform() });
  } catch (error) {
    return next(User.checkDuplicateEmail(error));
  }
};

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

// /**
//  * login with an existing user or creates a new one if valid accessToken token
//  * Returns jwt token
//  * @public
//  */
// exports.oAuth = async (req, res, next) => {
//   try {
//     const { user } = req;
//     const accessToken = user.token();
//     const token = generateTokenResponse(user, accessToken);
//     const userTransformed = user.transform();
//     return res.json({ token, user: userTransformed });
//   } catch (error) {
//     return next(error);
//   }
// };

// /**
//  * Returns a new jwt when given a valid refresh token
//  * @public
//  */
// exports.refresh = async (req, res, next) => {
//   try {
//     const { email, refreshToken } = req.body;
//     const refreshObject = await RefreshToken.findOneAndRemove({
//       userEmail: email,
//       token: refreshToken,
//     });
//     const { user, accessToken } = await User.findAndGenerateToken({ email, refreshObject });
//     const response = generateTokenResponse(user, accessToken);
//     return res.json(response);
//   } catch (error) {
//     return next(error);
//   }
// };
