'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('vehicle', [
      { vehicle_name: '12 chỗ', office_id: 1 },
      { vehicle_name: '16 chỗ', office_id: 1 },
      { vehicle_name: '29 chỗ', office_id: 1 },
      { vehicle_name: '35 chỗ', office_id: 1 },
      { vehicle_name: '45 chỗ', office_id: 1 },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('vehicle', null, {});
  },
};
