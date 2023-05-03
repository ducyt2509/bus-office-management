'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Transport', [
      {
        bus_schedule_id: 1,
        bus_id: 1,
        departure_date: "2023-05-03",
      },

      {
        bus_schedule_id: 2,
        bus_id: 1,
        departure_date: "2023-05-02",
      },

      {
        bus_schedule_id: 3,
        bus_id: 2,
        departure_date: "2023-05-02",
      }
      ,
      {
        bus_schedule_id: 4,
        bus_id: 2,
        departure_date: "2023-05-02",
      },
      {
        bus_schedule_id: 5,
        bus_id: 3,
        departure_date: "2023-05-02",
      }
      ,
      {
        bus_schedule_id: 6,
        bus_id: 3,
        departure_date: "2023-05-05",
      },
      {
        bus_schedule_id: 7,
        bus_id: 4,
        departure_date: "2023-05-05",
      }
      ,
      {
        bus_schedule_id: 8,
        bus_id: 4,
        departure_date: "2023-05-05",
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Transport', null, {});
  }
};
