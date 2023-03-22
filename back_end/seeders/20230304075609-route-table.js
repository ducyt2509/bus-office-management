"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
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
};
