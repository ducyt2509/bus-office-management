'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('route', [
      { city_fromm_id: 1, city_to_id: 2 },
      { city_fromm_id: 2, city_to_id: 3 },
      { city_fromm_id: 3, city_to_id: 4 },
      { city_fromm_id: 4, city_to_id: 5 },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('route', null, {});
  },
};
