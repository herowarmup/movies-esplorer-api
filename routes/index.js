const router = require('express').Router();
const { StatusCodes } = require('http-status-codes');
const { CustomError } = require('../middleware/errorHandler');

const users = require('./users');
const movies = require('./movies');
const auth = require('../middleware/auth');

const { createUser, login, signout } = require('../controllers/users');
const { createUserValidate, loginValidate } = require('../middleware/validators/userValidator');

router.post('/signup', createUserValidate, createUser);
router.post('/signin', loginValidate, login);

router.use('/users', auth, users);
router.use('/movies', auth, movies);
router.use('/signout', auth, signout);

router.use('*', auth, (req, res, next) => {
  next(new CustomError('Страница не найдена', StatusCodes.NOT_FOUND));
});

module.exports = router;
