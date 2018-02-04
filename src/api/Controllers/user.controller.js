const httpStatus = require('http-status');
const ServiceException = require('../Models/Exceptions/ServiceException');
const UserService = require('../Services/UserService');
const { UserModel } = require('../Models/UserModel');
const { handler: errorHandler } = require('../Helpers/error');

/**
 * Get user list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const userService = new UserService()
    const users = await userService.listUsers(req.query);
    const transformedUsers = users.map(user => user.transform());
    res.json(transformedUsers);
  } catch (error) {
    next(error);
  }
};

// /**
//  * Load user and append to req.
//  * @public
//  */
// exports.load = async (req, res, next, id) => {
//   try {
//     const userService = new UserService();
//     const user = await userService.getUserById(id);
//     req.locals = { user };
//     return next();
//   } catch (error) {
//     return errorHandler(error, req, res);
//   }
// };

/**
 * Get user
 * @public
 */
exports.get = async (req, res) =>
{
  try {
    if (!req.params || !req.params.userId){
      throw new ServiceException('No UserId defined');
    }
    const userService = new UserService();
    const user = await userService.getUserById(req.params.userId);
    res.status(httpStatus.OK);
    res.json(user.transform());
  } catch (error) {
    next(error);
  }
  res.json(req.locals.user.transform());
}

/**
 * Get logged in user info
 * @public
 */
exports.loggedIn = (req, res) => res.json(req.user.transform());

/**
 * Create new user
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const userService = new UserService();
    let user = new UserModel(req.body);
    const savedUser = await userService.createUser(user);
    res.status(httpStatus.OK);
    res.json(savedUser.transform());
  } catch (error) {
    next(error);
  }
};

/**
 * Update existing user
 * @public
 */
exports.update = (req, res, next) => {
  const ommitRole = req.locals.user.role !== 'admin' ? 'role' : '';
  const updatedUser = omit(req.body, ommitRole);
  const user = Object.assign(req.locals.user, updatedUser);

  user.save()
    .then(savedUser => res.json(savedUser.transform()))
    .catch(e => next(User.checkDuplicateEmail(e)));
};

/**
 * Delete user
 * @public
 */
exports.remove = async (req, res, next) => {
  try {
    if (!req.params || !req.params.userId){
      throw new ServiceException('No UserId defined');
    }
    const userService = new UserService();
    await userService.deleteUserById(req.params.userId);
    res.status(httpStatus.OK);
    res.json({});
  } catch (error) {
    next(error);
  }
};
