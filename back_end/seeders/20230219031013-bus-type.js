"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert("bus_type", [
			{ bus_type_name: "12 chỗ" },
			{ bus_type_name: "16 chỗ" },
			{ bus_type_name: "29 chỗ" },
			{ bus_type_name: "35 chỗ" },
			{ bus_type_name: "45 chỗ" },
		]);
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete("bus_type", null, {});
	},
};
