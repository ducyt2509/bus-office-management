"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert("location_on_bus_schedule", [
			{
				bus_schedule_id: 1,
				bus_detail: '["Văn Phòng Mỹ Đình: 10:30","Văn Phòng Giáp Bát: 11:00"]',
				bus_location_address:
					'["108 Trần Thái Tông, Dịch Vọng, Cầu Giấy, Hà Nội", "132 Trương Định, Giáp Bát, Hoàng Mai, Hà Nội"]',
				bus_location_type: 0,
			},
			{
				bus_schedule_id: 1,
				bus_detail: '["Văn Phòng Giáp Bát: 14:00", "Văn Phòng Mỹ Đình: 14:30"]',
				bus_location_address:
					'["132 Trương Định, Giáp Bát, Hoàng Mai, Hà Nội", "108 Trần Thái Tông, Dịch Vọng, Cầu Giấy, Hà Nội"]',
				bus_location_type: 1,
			},
		]);
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete("location_on_bus_schedule", null, {});
	},
};
