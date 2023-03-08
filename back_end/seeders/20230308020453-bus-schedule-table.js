"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert("bus_schedule", [
			{
				bus_id: 1,
				route_id: 1,
				price: 100000,
				time_from: "6:30",
				travel_time: 3,
				date_start: "2023-03-08",
				bus_schedule_status: 1,
				schedule_frequency: 1,
				bus_schedule_expire: 1,
			},
		]);
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete("route", null, {});
	},
};
