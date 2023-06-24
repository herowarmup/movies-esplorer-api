const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: [true, 'Введите название страны'],
  },
  director: {
    type: String,
    required: [true, 'Укажите режиссера'],
  },
  duration: {
    type: Number,
    required: [true, 'Укажите продолжительность'],
  },
  year: {
    type: String,
    required: [true, 'Укажите год выпуска'],
  },
  description: {
    type: String,
    required: [true, 'Заполните описание'],
  },
  image: {
    type: String,
    required: [true, 'Заполните описание'],
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Некорректный URL',
    },
  },
  trailerLink: {
    type: String,
    required: [true, 'Заполните описание'],
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Некорректный URL',
    },
  },
  thumbnail: {
    type: String,
    required: [true, 'Заполните описание'],
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Некорректный URL',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: [true, 'Введите название фильма'],
  },
  nameEN: {
    type: String,
    required: [true, 'Введите название фильма'],
  },
});

module.exports = mongoose.model('movie', movieSchema);
