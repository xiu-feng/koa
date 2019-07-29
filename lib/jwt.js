const jwt = require('jsonwebtoken');

const config = require('config').get('jwt');

exports.encode = user => jwt.sign({ id: user.id }, config.secret, { expiresIn: config.expiresIn });

exports.decode = token => jwt.decode(token, config.secret);
