'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('bus', [
      { bus_plate: '1', main_driver_id: 8, vehicle_id: 1, bus_status: 1 },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('route', null, {});
  },
};
