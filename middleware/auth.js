const jwt = require('jsonwebtoken');

const { StatusCodes } = require('http-status-codes');
const { CustomError } = require('./errorHandler');

const { NODE_ENV, JWT_SECRET, JWT_SECRET_DEV } = require('../utils/config');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return next(new CustomError('Необходима авторизация', StatusCodes.UNAUTHORIZED));
  }

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : JWT_SECRET_DEV);
  } catch (err) {
    return next(new CustomError('Необходима авторизация', StatusCodes.UNAUTHORIZED));
  }

  req.user = payload;

  return next();
};

module.exports = auth;
