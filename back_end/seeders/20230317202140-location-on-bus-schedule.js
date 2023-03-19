'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('location_on_bus_schedule', [
      {
        bus_detail: '["Văn Phòng Mĩ Đình: 10:30","Văn Phòng Giáp Bát: 11:00"]',
        bus_location_type: 0,
        bus_schedule_id: 1,
      },
      {
        bus_detail: '["Văn Phòng Giáp Bát: 14:00", "Văn Phòng Mĩ Đình: 14:30"]',
        bus_location_type: 1,
        bus_schedule_id: 1,
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('location_on_bus_schedule', null, {});
  },
};
