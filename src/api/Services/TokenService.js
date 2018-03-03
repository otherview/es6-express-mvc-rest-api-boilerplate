const moment = require('moment-timezone');
const jwt = require('jwt-simple');
const { jwtSecret, jwtExpirationInterval } = require('../../Configs/vars');

const TokenService = {
  token() {
    const playload = {
      exp: moment().add(jwtExpirationInterval, 'minutes').unix(),
      iat: moment().unix(),
      sub: this._id,
    };
    return jwt.encode(playload, jwtSecret);
  },

  /**
 * Returns a formated object with tokens
 * @public
 */
  generateTokenResponse(accessToken) {
    const tokenType = 'Bearer';
    const expiresIn = moment().add(jwtExpirationInterval, 'minutes');
    return {
      tokenType, accessToken, expiresIn,
    };
  },
};


module.exports = TokenService;
