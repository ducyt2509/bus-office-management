"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert("ticket", [
			{
				transaction_id: 1,
			},
			{
				transaction_id: 2,
			},
			{
				transaction_id: 3,
			},
			{
				transaction_id: 4,
			},
		]);
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete("Users", null, {});
	},
};
