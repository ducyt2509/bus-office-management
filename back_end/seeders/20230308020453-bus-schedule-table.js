'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('bus_schedule', [
      {bus_id: 1, route_id: 1, price: 100000, time_from:"", time_to:"", date_start:"", bus_schedule_status: 1, schedule_frequency: "", bus_schedule_expire:"" }
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('route', null, {});
  },
};
