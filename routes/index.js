const router = require('express').Router();

const NotFoundError = require('../errors/NotFoundError');
const { ERROR_MESSAGE_404 } = require('../utils/constants');

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
  next(new NotFoundError(ERROR_MESSAGE_404));
});

module.exports = router;
