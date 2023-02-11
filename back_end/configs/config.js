require('dotenv').config();

const host = process.env.DB_HOST || 'localhost';
const user = process.env.DB_USERNAME || 'root';
const password = process.env.DB_PASSWORD || '22042001';
const dbName = process.env.DB_NAME || 'testdb';

module.exports = {
  HOST: host,
  USER: user,
  PASSWORD: password,
  DB: dbName,
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
