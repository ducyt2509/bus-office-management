"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert("daily_bus_schedule", [
			{
        departure_status: 1,
        date: "2023-03-08",
        bus_schedule_id: 1,
			},
		]);
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete("daily_bus_schedule", null, {});
	},
};
