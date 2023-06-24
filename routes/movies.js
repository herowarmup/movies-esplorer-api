const router = require('express').Router();

const { getMovies, createMovie, dislikeMovie } = require('../controllers/movies');

const { movieValidate, movieIdValidate } = require('../middleware/validators/movieValidator');

router.get('/', getMovies);
router.post('/', movieValidate, createMovie);
router.delete('/:_id', movieIdValidate, dislikeMovie);

module.exports = router;
