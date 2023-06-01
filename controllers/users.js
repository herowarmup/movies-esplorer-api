/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { StatusCodes } = require('http-status-codes');

const User = require('../models/user');
const { CustomError } = require('../middleware/errorHandler');

const { NODE_ENV, JWT_SECRET, JWT_SECRET_DEV } = require('../utils/config');

async function getUser(req, res, next) {
  const { _id: userId } = req.user;

  try {
    const user = await User.findById(userId);
    if (!user) {
      next(new CustomError('Пользователь не найден', StatusCodes.NOT_FOUND));
    } else {
      res.send(user);
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new CustomError('Переданы некорректные данные', StatusCodes.BAD_REQUEST));
    } else {
      next(err);
    }
  }
}

async function createUser(req, res, next) {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      name,
      about,
      avatar,
      password: hash,
    }))
    .then((user) => {
      const { password: hashedPassword, ...userData } = user.toObject();
      res.status(StatusCodes.CREATED).send({ data: userData });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new CustomError('Пользователь с таким email уже существует', StatusCodes.CONFLICT));
      } else if (err.name === 'ValidationError') {
        next(new CustomError('Проверьте правильность данных', StatusCodes.BAD_REQUEST));
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
      return next(new CustomError('Пользователь не найден', StatusCodes.UNAUTHORIZED));
    }
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return next(new CustomError('Неверный пароль', StatusCodes.UNAUTHORIZED));
    }

    const token = jwt.sign(
      { _id: user._id },
      NODE_ENV === 'production' ? JWT_SECRET : JWT_SECRET_DEV,
      { expiresIn: '7d' },
    );

    res.cookie('jwt', token, {
      maxAge: 3600000,
      httpOnly: true,
      sameSite: true,
    });

    return res.status(StatusCodes.OK).send({ token });
  } catch (err) {
    next(err);
  }
}

const signout = (req, res) => {
  res.clearCookie('jwt').send({ message: 'Вы вышли из системы' });
};

async function updateUser(req, res, next) {
  const { email, name } = req.body;

  const userId = req.user._id;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { email, name },
      { new: true, runValidators: true },
    );
    if (!updatedUser) {
      return next(new CustomError('Пользователь не найден', StatusCodes.NOT_FOUND));
    }
    return res.send(updatedUser);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new CustomError('Проверьте правильность данных', StatusCodes.BAD_REQUEST));
    } else {
      next(err);
    }
  }
}

module.exports = {
  getUser,
  createUser,
  login,
  signout,
  updateUser,
};
