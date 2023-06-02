const regExUrl = /https?:\/\/w{0,3}\.?[\w0-9-]{1,10}\.\w{2,3}[\w\d\-._~:/?#[\]@!$&'()*+,;=]{0,}/m;

const ERROR_MESSAGE_SERVER = 'На сервере произошла ошибка';
const ERROR_MESSAGE_UNAUTHORIZATION = 'Необходима авторизация+';
const ERROR_MESSAGE_INCORRECT_DATA = 'Переданы неккоректные данные+';
const ERROR_MESSAGE_CONFLICT = 'Пользователь с таким email уже существует+';
const ERROR_MESSAGE_USER_NOT_FOUND = 'Пользователь не найден+';
const ERROR_MESSAGE_FILM_NOT_FOUND = 'Фильм не найден+';
const ERROR_MESSAGE_FORBIDDEN_DELETE = 'Нельзя удалять чужие фильмы+';
const ERROR_MESSAGE_404 = 'Страницы не найдена';

const MESSAGE_SIGNOUT = 'Вы вышли из системы+';

module.exports = {
  regExUrl,
  ERROR_MESSAGE_SERVER,
  ERROR_MESSAGE_INCORRECT_DATA,
  ERROR_MESSAGE_UNAUTHORIZATION,
  ERROR_MESSAGE_CONFLICT,
  MESSAGE_SIGNOUT,
  ERROR_MESSAGE_USER_NOT_FOUND,
  ERROR_MESSAGE_FILM_NOT_FOUND,
  ERROR_MESSAGE_FORBIDDEN_DELETE,
  ERROR_MESSAGE_404,
};
