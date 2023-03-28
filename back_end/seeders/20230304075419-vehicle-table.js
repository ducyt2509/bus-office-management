'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('vehicle_type', [
      { vehicle_type_name: '12 chỗ', number_seat: 12 },
      { vehicle_type_name: '16 chỗ', number_seat: 16 },
      { vehicle_type_name: '29 chỗ', number_seat: 29 },
      { vehicle_type_name: '35 chỗ', number_seat: 35 },
      { vehicle_type_name: '45 chỗ', number_seat: 45 },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('vehicle_type', null, {});
  },
};
