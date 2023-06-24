const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'E-mail должен быть заполнен.'],
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: 'Введен неккоректный e-mail или пароль.',
    },
  },
  password: {
    type: String,
    required: [true, 'Пароль должен быть заполнен.'],
    select: false,
  },
  name: {
    type: String,
    required: [true, 'Введите имя'],
    minlength: [2, 'Минимальная длина имени - 2 символа'],
    maxlength: [30, 'Максимальная длина имени - 30 символов'],
  },
});

module.exports = mongoose.model('user', userSchema);
