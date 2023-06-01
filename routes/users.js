const router = require('express').Router();

const { getUser, updateUser } = require('../controllers/users');

const { userDataValidator } = require('../middleware/validators/userValidator');

router.get('/me', getUser);
router.patch('/me', userDataValidator, updateUser);

module.exports = router;
