const { StatusCodes } = require('http-status-codes');

const Movie = require('../models/movie');

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

const {
  ERROR_MESSAGE_FILM_NOT_FOUND,
  ERROR_MESSAGE_INCORRECT_DATA,
  ERROR_MESSAGE_FORBIDDEN_DELETE,
} = require('../utils/constants');

function getMovies(req, res, next) {
  const owner = req.user._id;

  Movie.find({ owner })
    .populate(['owner'])
    .then((movies) => res.send(movies))
    .catch(next);
}

function createMovie(req, res, next) {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  const { _id: userId } = req.user;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner: userId,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => movie.populate('owner'))
    .then((movie) => res.status(StatusCodes.CREATED).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(ERROR_MESSAGE_INCORRECT_DATA));
      } else {
        next(err);
      }
    });
}

async function dislikeMovie(req, res, next) {
  const { _id: movieId } = req.params;
  const { _id: userId } = req.user;

  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        return next(new NotFoundError(ERROR_MESSAGE_FILM_NOT_FOUND));
      }
      if (userId !== movie.owner.toString()) {
        return next(new ForbiddenError(ERROR_MESSAGE_FORBIDDEN_DELETE));
      }
      return Movie.findByIdAndRemove(movieId)
        .then((movieForDislikeLike) => { res.send(movieForDislikeLike); });
    })
    .catch(next);
}

module.exports = {
  getMovies,
  createMovie,
  dislikeMovie,
};
