'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('bus', [
      {
        vehicle_plate: '1',
        main_driver_id: 8,
        support_driver_id: 8,
        vehicle_id: 1,
        vehicle_status: 1,
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('route', null, {});
  },
};
