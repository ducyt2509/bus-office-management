"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
<<<<<<< HEAD
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert("route", [
			{ city_from_id: 47, city_to_id: 14 },
			{ city_from_id: 14, city_to_id: 47 },
			{ city_from_id: 47, city_to_id: 16 },
			{ city_from_id: 16, city_to_id: 47 },
			{ city_from_id: 47, city_to_id: 32 },
			{ city_from_id: 32, city_to_id: 47 },
			{ city_from_id: 47, city_to_id: 59 },
			{ city_from_id: 59, city_to_id: 47 },
		]);
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete("route", null, {});
	},
=======
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
>>>>>>> 55c963ed052f9dfa528ae3593a0089e1feab6bf2
};
