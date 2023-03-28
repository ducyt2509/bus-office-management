'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('bus', [
      {
        vehicle_plate: '29B-07994',
        main_driver_id: 10,
        support_driver_id: 11,
        vehicle_type_id: 1,
        vehicle_status: 1,
      },
      {
        vehicle_plate: '30F-01294',
        main_driver_id: 12,
        support_driver_id: 13,
        vehicle_type_id: 4,
        vehicle_status: 1,
      },

      {
        vehicle_plate: '30B-40621',
        main_driver_id: 14,
        support_driver_id: 15,
        vehicle_type_id: 4,
        vehicle_status: 1,
      },

      {
        vehicle_plate: '30B-42341',
        main_driver_id: 16,
        support_driver_id: 17,
        vehicle_type_id: 4,
        vehicle_status: 1,
      },

      {
        vehicle_plate: '30B-05492',
        main_driver_id: 18,
        support_driver_id: 19,
        vehicle_type_id: 5,
        vehicle_status: 1,
      },

      {
        vehicle_plate: '30B-41319',
        main_driver_id: 20,
        support_driver_id: 11,
        vehicle_type_id: 5,
        vehicle_status: 1,
      },

      {
        vehicle_plate: '29F-75690',
        main_driver_id: 21,
        support_driver_id: 13,
        vehicle_type_id: 5,
        vehicle_status: 1,
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('route', null, {});
  },
};
