const jwt = require('jsonwebtoken');

const UnauthorizedError = require('../errors/UnauthorizedError');

const { ERROR_MESSAGE_UNAUTHORIZATION } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET, JWT_SECRET_KEY } = require('../utils/config');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer')) {
    return next(new UnauthorizedError(ERROR_MESSAGE_UNAUTHORIZATION));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : JWT_SECRET_KEY);
  } catch (err) {
    return next(new UnauthorizedError(ERROR_MESSAGE_UNAUTHORIZATION));
  }

  req.user = payload;

  return next();
};

module.exports = auth;
