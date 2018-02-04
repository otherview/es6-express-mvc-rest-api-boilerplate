const moment = require('moment-timezone');
const jwt = require('jwt-simple');
const RefreshToken = require('../Models/refreshToken.model');
const { env, jwtSecret, jwtExpirationInterval } = require('../../Configs/vars');
const TokenService = {};

TokenService.__proto__.token = function() {
  const playload = {
    exp: moment().add(jwtExpirationInterval, 'minutes').unix(),
    iat: moment().unix(),
    sub: this._id,
  };
  return jwt.encode(playload, jwtSecret);
}

/**
 * Returns a formated object with tokens
 * @private
 */
TokenService.__proto__.generateTokenResponse = function(user, accessToken) {
  const tokenType = 'Bearer';
  const refreshToken = RefreshToken.generate(user).token;
  const expiresIn = moment().add(jwtExpirationInterval, 'minutes');
  return {
    tokenType, accessToken, refreshToken, expiresIn,
  };
}

module.export = TokenService;
