require('dotenv').config();
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
