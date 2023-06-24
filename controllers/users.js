const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { StatusCodes } = require('http-status-codes');

const User = require('../models/user');

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');

const {
  ERROR_MESSAGE_USER_NOT_FOUND,
  ERROR_MESSAGE_INCORRECT_DATA,
  ERROR_MESSAGE_CONFLICT,
  MESSAGE_SIGNOUT,
} = require('../utils/constants');

const { NODE_ENV, JWT_SECRET, JWT_SECRET_KEY } = require('../utils/config');

async function getUser(req, res, next) {
  const { _id: userId } = req.user;

  try {
    const user = await User.findById(userId);
    if (!user) {
      next(new NotFoundError(ERROR_MESSAGE_USER_NOT_FOUND));
    } else {
      res.send(user);
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError(ERROR_MESSAGE_INCORRECT_DATA));
    } else {
      next(err);
    }
  }
}

async function createUser(req, res, next) {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => {
      const { password: hashedPassword, ...userData } = user.toObject();
      res.status(StatusCodes.CREATED).send({ data: userData });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError(ERROR_MESSAGE_CONFLICT));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError(ERROR_MESSAGE_INCORRECT_DATA));
      } else {
        next(err);
      }
    });
}

async function login(req, res, next) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return next(new BadRequestError(ERROR_MESSAGE_USER_NOT_FOUND));
    }
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return next(new BadRequestError(ERROR_MESSAGE_USER_NOT_FOUND));
    }

    const token = jwt.sign(
      { _id: user._id },
      NODE_ENV === 'production' ? JWT_SECRET : JWT_SECRET_KEY,
      { expiresIn: '7d' },
    );

    return res.status(StatusCodes.OK).send({ token });
  } catch (err) {
    return next(err);
  }
}

const signout = (req, res) => {
  res.clearCookie('jwt').send({ message: MESSAGE_SIGNOUT });
};

async function updateUser(req, res, next) {
  const { name, email } = req.body;

  const userId = req.user._id;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { email, name },
      { new: true, runValidators: true },
    );
    if (!updatedUser) {
      return next(new NotFoundError(ERROR_MESSAGE_USER_NOT_FOUND));
    }
    return res.send(updatedUser);
  } catch (err) {
    if (err.code === 11000) {
      return next(new BadRequestError(ERROR_MESSAGE_CONFLICT));
    }
    if (err.name === 'ValidationError') {
      return next(new BadRequestError(ERROR_MESSAGE_INCORRECT_DATA));
    }
    return next(err);
  }
}

module.exports = {
  getUser,
  createUser,
  login,
  signout,
  updateUser,
};
