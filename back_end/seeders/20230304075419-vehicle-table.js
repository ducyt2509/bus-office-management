"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert("vehicle", [
			{ vehicle_name: "12 chỗ", vehicle_number_seat: 12, office_id: 1 },
			{ vehicle_name: "16 chỗ", vehicle_number_seat: 16, office_id: 1 },
			{ vehicle_name: "29 chỗ", vehicle_number_seat: 29, office_id: 1 },
			{ vehicle_name: "35 chỗ", vehicle_number_seat: 35, office_id: 1 },
			{ vehicle_name: "45 chỗ", vehicle_number_seat: 45, office_id: 1 },
		]);
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete("vehicle", null, {});
	},
};
