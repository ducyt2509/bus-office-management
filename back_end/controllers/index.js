const user = require('./user');
const bus_schedule = require('./bus_schedule');
const vehicle = require('./vehicle');
const bus = require('./bus');
const city = require('./city');
const location = require('./location');
const office = require('./office');
const role = require('./role');
const route = require('./route');
const ticket = require('./ticket');
const transaction = require('./transaction');

module.exports = {
  bus_schedule,
  vehicle,
  bus,
  city,
  location,
  office,
  role,
  route,
  ticket,
  transaction,
  user,
};
