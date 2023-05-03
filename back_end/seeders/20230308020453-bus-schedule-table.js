'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('bus_schedule', [
      // HÀ NỘI - NAM ĐỊNH

      // BS 1 
      {
        route_id: 1,
        price: 100000,
        time_from: 7.5,
        travel_time: 3,
        departure_location_id: 2,
        arrive_location_id: 9,
        effective_date: '2023-04-15',
        refresh_date: "2023-05-14",
        bus_schedule_status: 1,
        schedule_frequency: 1,
        bus_schedule_expire: 7,
      },

      {
        route_id: 1,
        price: 100000,
        time_from: 12,
        travel_time: 3,
        departure_location_id: 2,
        arrive_location_id: 9,
        effective_date: '2023-04-15',
        refresh_date: "2023-05-14",
        bus_schedule_status: 1,
        schedule_frequency: 1,
        bus_schedule_expire: 7,
      },
      {
        route_id: 1,
        price: 100000,
        time_from: 16.5,
        travel_time: 3,
        departure_location_id: 2,
        arrive_location_id: 9,
        effective_date: '2023-04-15',
        refresh_date: "2023-05-14",
        bus_schedule_status: 1,
        schedule_frequency: 1,
        bus_schedule_expire: 7,
      },
      // BS 2 
      {
        route_id: 1,
        price: 120000,
        time_from: 9,
        travel_time: 3,
        departure_location_id: 1,
        arrive_location_id: 12,
        effective_date: '2023-03-10',
        refresh_date: "2023-05-14",
        bus_schedule_status: 1,
        schedule_frequency: 1,
        bus_schedule_expire: 7,
      },

      {
        route_id: 1,
        price: 120000,
        time_from: 15.3,
        travel_time: 3,
        departure_location_id: 1,
        arrive_location_id: 12,
        effective_date: '2023-03-10',
        refresh_date: "2023-05-14",
        bus_schedule_status: 1,
        schedule_frequency: 1,
        bus_schedule_expire: 7,
      },


      {
        route_id: 1,
        price: 120000,
        time_from: 19,
        travel_time: 3,
        departure_location_id: 1,
        arrive_location_id: 12,
        effective_date: '2023-03-10',
        refresh_date: "2023-05-14",
        bus_schedule_status: 1,
        schedule_frequency: 1,
        bus_schedule_expire: 7,
      },

      // BS 3
      {
        route_id: 1,
        price: 120000,
        time_from: 8,
        travel_time: 3,
        departure_location_id: 3,
        arrive_location_id: 12,
        effective_date: '2023-04-17',
        refresh_date: "2023-05-14",
        bus_schedule_status: 1,
        schedule_frequency: 1,
        bus_schedule_expire: 7,
      },


      {
        route_id: 1,
        price: 120000,
        time_from: 13.2,
        travel_time: 3,
        departure_location_id: 3,
        arrive_location_id: 12,
        effective_date: '2023-04-17',
        refresh_date: "2023-05-14",
        bus_schedule_status: 1,
        schedule_frequency: 1,
        bus_schedule_expire: 7,
      },
      //  NAM ĐỊNH - HÀ NỘI 

      // BS 1 
      {
        route_id: 2,
        price: 100000,
        time_from: 7.5,
        travel_time: 3,
        departure_location_id: 9,
        arrive_location_id: 2,
        effective_date: '2023-04-15',
        refresh_date: "2023-05-14",
        bus_schedule_status: 1,
        schedule_frequency: 1,
        bus_schedule_expire: 7,
      },

      {
        route_id: 2,
        price: 100000,
        time_from: 12,
        travel_time: 3,
        departure_location_id: 9,
        arrive_location_id: 2,
        effective_date: '2023-04-15',
        refresh_date: "2023-05-14",
        bus_schedule_status: 1,
        schedule_frequency: 1,
        bus_schedule_expire: 7,
      },
      {
        route_id: 2,
        price: 100000,
        time_from: 16.5,
        travel_time: 3,
        departure_location_id: 9,
        arrive_location_id: 2,
        effective_date: '2023-04-15',
        refresh_date: "2023-05-14",
        bus_schedule_status: 1,
        schedule_frequency: 1,
        bus_schedule_expire: 7,
      },
      // BS 2 
      {
        route_id: 2,
        price: 120000,
        time_from: 9,
        travel_time: 3,
        departure_location_id: 12,
        arrive_location_id: 1,
        effective_date: '2023-03-10',
        refresh_date: "2023-05-14",
        bus_schedule_status: 1,
        schedule_frequency: 1,
        bus_schedule_expire: 7,
      },

      {
        route_id: 2,
        price: 120000,
        time_from: 15.3,
        travel_time: 3,
        departure_location_id: 12,
        arrive_location_id: 1,
        effective_date: '2023-03-10',
        refresh_date: "2023-05-14",
        bus_schedule_status: 1,
        schedule_frequency: 1,
        bus_schedule_expire: 7,
      },


      {
        route_id: 2,
        price: 120000,
        time_from: 19,
        travel_time: 3,
        departure_location_id: 12,
        arrive_location_id: 1,
        effective_date: '2023-03-10',
        refresh_date: "2023-05-14",
        bus_schedule_status: 1,
        schedule_frequency: 1,
        bus_schedule_expire: 7,
      },

      // BS 3
      {
        route_id: 2,
        price: 120000,
        time_from: 8,
        travel_time: 3,
        departure_location_id: 12,
        arrive_location_id: 3,
        effective_date: '2023-04-17',
        refresh_date: "2023-05-14",
        bus_schedule_status: 1,
        schedule_frequency: 1,
        bus_schedule_expire: 7,
      },


      {
        route_id: 2,
        price: 120000,
        time_from: 13.5,
        travel_time: 3,
        departure_location_id: 12,
        arrive_location_id: 3,
        effective_date: '2023-04-17',
        refresh_date: "2023-05-14",
        bus_schedule_status: 1,
        schedule_frequency: 1,
        bus_schedule_expire: 7,
      },

      // RAW 

      {
        route_id: 4,
        price: 150000,
        time_from: 18.5,
        travel_time: 8,
        departure_location_id: 10,
        arrive_location_id: 1,
        effective_date: '2023-04-15',
        refresh_date: "2023-05-14",
        bus_schedule_status: 1,
        schedule_frequency: 1,
        bus_schedule_expire: 7,
      },

      {
        route_id: 5,
        price: 150000,
        time_from: 6,
        travel_time: 4.5,
        departure_location_id: 2,
        arrive_location_id: 13,
        effective_date: '2023-04-15',
        refresh_date: "2023-05-14",
        bus_schedule_status: 1,
        schedule_frequency: 1,
        bus_schedule_expire: 7,
      },

      {
        route_id: 6,
        price: 150000,
        time_from: 12.5,
        travel_time: 4.5,
        departure_location_id: 13,
        arrive_location_id: 2,
        effective_date: '2023-04-15',
        refresh_date: "2023-05-14",
        bus_schedule_status: 1,
        schedule_frequency: 1,
        bus_schedule_expire: 7,
      },

      {
        route_id: 7,
        price: 150000,
        time_from: 14.5,
        travel_time: 3.5,
        departure_location_id: 1,
        arrive_location_id: 9,
        effective_date: '2023-04-15',
        refresh_date: "2023-05-14",
        bus_schedule_status: 1,
        schedule_frequency: 1,
        bus_schedule_expire: 7,
      },

      {
        route_id: 8,
        price: 150000,
        time_from: 18.5,
        travel_time: 3.5,
        departure_location_id: 1,
        arrive_location_id: 9,
        effective_date: '2023-04-15',
        refresh_date: "2023-05-14",
        bus_schedule_status: 1,
        schedule_frequency: 1,
        bus_schedule_expire: 7,
      },

      {
        route_id: 8,
        price: 150000,
        time_from: 18.5,
        travel_time: 3.5,
        departure_location_id: 1,
        arrive_location_id: 9,
        effective_date: '2023-04-20',
        refresh_date: "2023-05-14",
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
