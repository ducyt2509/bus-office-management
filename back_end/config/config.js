require('dotenv').config();
module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: true,
    seederStorage: 'sequelize',
    seederStorageTableName: 'SequelizeSeeder',
    // timezone: '+07:00'
  },
  test: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
    seederStorage: 'sequelize',
    seederStorageTableName: 'SequelizeSeeder',
    // timezone: '+07:00'
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
    seederStorage: 'sequelize',
    seederStorageTableName: 'SequelizeSeeder',
    // timezone: '+07:00'
  },
};
