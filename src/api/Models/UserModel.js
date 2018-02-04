const moment = require('moment-timezone');
const jwt = require('jwt-simple');
const bcrypt = require('bcryptjs');
const { env, jwtSecret, jwtExpirationInterval } = require('../../Configs/vars');

class UserModel {
  constructor(options) {
    this.id = options.id || undefined;
    this.email = options.email || undefined;
    this.password = options.password || undefined;
    this.role = options.role || undefined;
  }

  async passwordMatches(password) {
    const derp =  await bcrypt.compare(password, this.password);
    return  derp;
  }

  token() {
    const playload = {
      exp: moment().add(jwtExpirationInterval, 'minutes').unix(),
      iat: moment().unix(),
      sub: this.id,
    };
    return jwt.encode(playload, jwtSecret);
  }

  transform() {
    const transformed = {};
    const fields = ['id', 'name', 'email', 'picture', 'role', 'createdAt'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  }
}

exports.UserModel = UserModel;
