require('dotenv').config();
// const host = process.env.DB_HOST || 'localhost';
// const user = process.env.DB_USERNAME || 'root';
// const password = process.env.DB_PASSWORD || '22042001';
// const dbName = process.env.DB_NAME || 'testdb';
module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
    seederStorage: 'sequelize',
    seederStorageTableName: 'SequelizeSeeder',
  },
  test: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
    seederStorage: 'sequelize',
    seederStorageTableName: 'SequelizeSeeder',
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
    seederStorage: 'sequelize',
    seederStorageTableName: 'SequelizeSeeder',
  },
};
