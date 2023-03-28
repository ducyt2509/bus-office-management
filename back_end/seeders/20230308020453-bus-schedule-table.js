'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('bus_schedule', [
      {
        route_id: 5,
        price: 30000,
        time_from: 7.5,
        travel_time: 3.5,
        departure_location_id: 1,
        arrive_location_id: 9,
        effective_date: '2023-03-23',
        refresh_date: '2023-03-23',
        bus_schedule_status: 1,
        schedule_frequency: 1,
        bus_schedule_expire: 7,
      },
      {
        route_id: 5,
        price: 30000,
        time_from: 11.5,
        travel_time: 3.5,
        departure_location_id: 1,
        arrive_location_id: 9,
        effective_date: '2023-03-23',
        refresh_date: '2023-03-23',
        bus_schedule_status: 1,
        schedule_frequency: 1,
        bus_schedule_expire: 7,
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('bus_schedule', null, {});
  },
};
