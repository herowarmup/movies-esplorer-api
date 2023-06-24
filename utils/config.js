const {
  NODE_ENV,
  PORT = 3000,
  DB_PROD,
  JWT_SECRET,
} = process.env;

const JWT_SECRET_KEY = 'secret-key-1234';
const DB_DEV = 'mongodb://127.0.0.1:27017/bitfilmsdb';

module.exports = {
  NODE_ENV,
  PORT,
  DB_PROD,
  DB_DEV,
  JWT_SECRET,
  JWT_SECRET_KEY,
};
