'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('bus_schedule', [
      {
        route_id: 1,
        price: 30000,
        time_from: 7.5,
        travel_time: 3.5,
        departure_location_id: 1,
        arrive_location_id: 9,
        effective_date: '2023-04-15',
        refresh_date: '2023-05-01',
        bus_schedule_status: 1,
        schedule_frequency: 1,
        bus_schedule_expire: 7,
      },
      {
        route_id: 2,
        price: 30000,
        time_from: 11.5,
        travel_time: 3.5,
        departure_location_id: 9,
        arrive_location_id: 1,
        effective_date: '2023-04-15',
        refresh_date: '2023-05-01',
        bus_schedule_status: 1,
        schedule_frequency: 1,
        bus_schedule_expire: 7,
      },
      {
        route_id: 3,
        price: 30000,
        time_from: 7.5,
        travel_time: 8,
        departure_location_id: 1,
        arrive_location_id: 10,
        effective_date: '2023-04-15',
        refresh_date: '2023-05-01',
        bus_schedule_status: 1,
        schedule_frequency: 1,
        bus_schedule_expire: 7,
      },
      {
        route_id: 4,
        price: 30000,
        time_from: 18.5,
        travel_time: 8,
        departure_location_id: 10,
        arrive_location_id: 1,
        effective_date: '2023-04-15',
        refresh_date: '2023-05-01',
        bus_schedule_status: 1,
        schedule_frequency: 1,
        bus_schedule_expire: 7,
      },

      {
        route_id: 5,
        price: 30000,
        time_from: 6,
        travel_time: 4.5,
        departure_location_id: 2,
        arrive_location_id: 13,
        effective_date: '2023-04-15',
        refresh_date: '2023-04-22',
        bus_schedule_status: 1,
        schedule_frequency: 1,
        bus_schedule_expire: 7,
      },

      {
        route_id: 6,
        price: 30000,
        time_from: 12.5,
        travel_time: 4.5,
        departure_location_id: 13,
        arrive_location_id: 2,
        effective_date: '2023-04-15',
        refresh_date: '2023-04-22',
        bus_schedule_status: 1,
        schedule_frequency: 1,
        bus_schedule_expire: 7,
      },

      {
        route_id: 7,
        price: 30000,
        time_from: 14.5,
        travel_time: 3.5,
        departure_location_id: 1,
        arrive_location_id: 9,
        effective_date: '2023-04-15',
        refresh_date: '2023-04-22',
        bus_schedule_status: 1,
        schedule_frequency: 1,
        bus_schedule_expire: 7,
      },

      {
        route_id: 8,
        price: 30000,
        time_from: 18.5,
        travel_time: 3.5,
        departure_location_id: 1,
        arrive_location_id: 9,
        effective_date: '2023-04-15',
        refresh_date: '2023-04-22',
        bus_schedule_status: 1,
        schedule_frequency: 1,
        bus_schedule_expire: 7,
      },

      {
        route_id: 8,
        price: 30000,
        time_from: 18.5,
        travel_time: 3.5,
        departure_location_id: 1,
        arrive_location_id: 9,
        effective_date: '2023-04-20',
        refresh_date: '2023-04-27',
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


const hello = () => {
  return 'Hello, world!';
}
