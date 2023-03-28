const user = require('./user');
const bus_schedule = require('./bus_schedule');
const vehicle_type = require('./vehicle_type');
const bus = require('./bus');
const city = require('./city');
const location = require('./location');
const office = require('./office');
const role = require('./role');
const route = require('./route');
const ticket = require('./ticket');
const contact = require('./contact');
const transaction = require('./transaction');
const transport = require('./transport');

module.exports = {
  bus_schedule,
  vehicle_type,
  bus,
  city,
  location,
  office,
  role,
  route,
  ticket,
  transaction,
  user,
  contact,
  transport,
};
