const moment = require('moment-timezone');
const jwt = require('jwt-simple');
const bcrypt = require('bcryptjs');
const { jwtSecret, jwtExpirationInterval } = require('../../Configs/vars');

class UserModel {
  constructor(options) {
    this.id = options.id || undefined;
    this.email = options.email || undefined;
    this.password = options.password || undefined;
    this.role = options.role || undefined;
    this.status = options.status || undefined;
  }

  async passwordMatches(password) {
    return bcrypt.compare(password, this.password);
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
