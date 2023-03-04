'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('office', [
      { office_name: 'Test office', city_id: 1, office_address: 'ha Noi' },
      //   { vehicle_name: '12 chỗ', office_id: 1 },
      //   { vehicle_name: '16 chỗ', office_id: 1 },
      //   { vehicle_name: '29 chỗ', office_id: 1 },
      //   { vehicle_name: '35 chỗ', office_id: 1 },
      //   { vehicle_name: '45 chỗ', office_id: 1 },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('office', null, {});
  },
};
