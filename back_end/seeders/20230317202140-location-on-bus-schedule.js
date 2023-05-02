"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert("location_on_bus_schedule", [
			{
				bus_schedule_id: 1,
				bus_detail:
					'["Văn Phòng Mỹ Đình: 07:30","Văn Phòng Giáp Bát: 08:45" ,"Văn Phòng Thanh Xuân:  "]',
				bus_location_address:
					'["108 Trần Thái Tông, Dịch Vọng, Cầu Giấy, Hà Nội", "132 Trương Định, Giáp Bát, Hoàng Mai, Hà Nội", "231C Đ. Nguyễn Trãi, Thanh Xuân Bắc, Thanh Xuân, Hà Nội"]',
				bus_location_type: 0,
			}, 
			{
				bus_schedule_id: 1,
				bus_detail:
					'["Văn Phòng Nghĩa Hưng: 07:30" , "Văn Phòng Lê Hồng Phong: 07:50" , "Văn Phòng Nam Định: 08:10"]',
				bus_location_address:
					'["108 Trần Thái Tông, Dịch Vọng, Cầu Giấy, Hà Nội", "132 Trương Định, Giáp Bát, Hoàng Mai, Hà Nội" , "1 Đ. Ngọc Hồi, Hoàng Liệt, Hoàng Mai, Hà Nội" , "231C Đ. Nguyễn Trãi, Thanh Xuân Bắc, Thanh Xuân, Hà Nội"]',
				bus_location_type: 1,
			}
		]);
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete("location_on_bus_schedule", null, {});
	},
};
