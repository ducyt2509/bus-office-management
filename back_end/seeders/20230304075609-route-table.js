'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('route', [
      { city_from_id: 1, city_to_id: 2 },
      { city_from_id: 2, city_to_id: 3 },
      { city_from_id: 3, city_to_id: 4 },
      { city_from_id: 4, city_to_id: 5 },
      { city_from_id: 14, city_to_id: 47 },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('route', null, {});
  },
};
