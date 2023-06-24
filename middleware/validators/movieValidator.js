const { celebrate, Joi } = require('celebrate');
const { regExUrl } = require('../../utils/constants');

const movieValidate = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().regex(regExUrl),
    trailerLink: Joi.string().required().regex(regExUrl),
    thumbnail: Joi.string().required().regex(regExUrl),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const movieIdValidate = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().hex().length(24).required(),
  }),
});

module.exports = {
  movieValidate,
  movieIdValidate,
};
