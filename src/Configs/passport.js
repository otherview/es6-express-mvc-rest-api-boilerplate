const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const { jwtSecret } = require('./vars');
// const authProviders = require('../api/services/authProviders');
const UserService = require('../api/Services/UserService');

const jwtOptions = {
  secretOrKey: jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
};

const jwt = async (payload, done) => {
  try {
    const userService = new UserService();
    const user = await userService.getUserById(payload.sub);
    if (user) return done(null, user);
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
};

// const oAuth = service => async (token, done) => {
//   try {
//     const userData = await authProviders[service](token);
//     const user = await User.oAuthLogin(userData);
//     return done(null, user);
//   } catch (err) {
//     return done(err);
//   }
// };

exports.jwt = new JwtStrategy(jwtOptions, jwt);
// exports.facebook = new BearerStrategy(oAuth('facebook'));
// exports.google = new BearerStrategy(oAuth('google'));
