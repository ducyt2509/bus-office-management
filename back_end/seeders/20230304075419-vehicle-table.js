'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('vehicle_type', [
      { vehicle_type_name: '12 chỗ', number_seat: 12 },
      { vehicle_type_name: '22 chỗ', number_seat: 22 },
      { vehicle_type_name: '36 chỗ', number_seat: 36 },
      { vehicle_type_name: '40 chỗ', number_seat: 40 },
      { vehicle_type_name: '44 chỗ', number_seat: 44 },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('vehicle_type', null, {});
  },
};
