'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.users = require('./user')(sequelize, Sequelize);
db.roles = require('./role')(sequelize, Sequelize);
db.cities = require('./city')(sequelize, Sequelize);
db.bus_types = require('./bus_type')(sequelize, Sequelize);
db.locations = require('./location')(sequelize, Sequelize);
db.routes = require('./route')(sequelize, Sequelize);
db.buses = require('./bus')(sequelize, Sequelize);
db.bus_schedules = require('./bus_schedule')(sequelize, Sequelize);
db.offices = require('./office')(sequelize, Sequelize);
db.transactions = require('./transaction')(sequelize, Sequelize);
db.tickets = require('./ticket')(sequelize, Sequelize);

db.buses.belongsTo(db.users, { foreignKey: 'main_driver_id' });
db.users.hasMany(db.buses, { foreignKey: 'main_driver_id' });

// db.buses.belongsTo(db.users, { foreignKey: 'support_driver_id' });
// db.users.hasMany(db.buses, { foreignKey: 'support_driver_id' });

module.exports = db;
