"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert("location_on_bus_schedule", [
			//0 Đón , 1 TRẢ
			{
				bus_schedule_id: 1,
				bus_detail:
					'["Văn Phòng Mỹ Đình: 07:30","Văn Phòng Giáp Bát: 08:10",  ]',
				bus_location_address:
					'["108 Trần Thái Tông, Dịch Vọng, Cầu Giấy, Hà Nội", "132 Trương Định, Giáp Bát, Hoàng Mai, Hà Nội"]',
				bus_location_type: 0,
			}, 
			{
				bus_schedule_id: 1,
				bus_detail:
					'["Văn Phòng Nam Định: 9h15 " , "Văn Phòng Lê Hồng Phong: 9h45" , "Văn Phòng Nghĩa Hưng: 10:00"]',
				bus_location_address:
					'["272 Trần Hưng Đạo, Bà Triệu, TP. Nam Định", "176 Vị Xuyên, phường Vị Xuyên, Tp. Nam Định" , "Liễu Đề, Nghĩa Hưng, Nam Định"]',
				bus_location_type: 1,
			}
		]);
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete("location_on_bus_schedule", null, {});
	},
};
