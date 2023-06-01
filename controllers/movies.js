const { StatusCodes } = require('http-status-codes');

const Movie = require('../models/movie');
const { CustomError } = require('../middleware/errorHandler');

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
        next(new CustomError('Проверьте правильность данных', StatusCodes.BAD_REQUEST));
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
        return next(new CustomError('Фильм не найден', StatusCodes.NOT_FOUND));
      }
      if (userId !== movie.owner.toString()) {
        return next(new CustomError('Нельзя удалять чужие фильмы', StatusCodes.FORBIDDEN));
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
