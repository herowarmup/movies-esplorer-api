const { StatusCodes } = require('http-status-codes');

const { ERROR_MESSAGE_SERVER } = require('../utils/constants');

const errorHandler = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === StatusCodes.INTERNAL_SERVER_ERROR
        ? ERROR_MESSAGE_SERVER
        : message,
    });
  next();
};

module.exports = { errorHandler };
