"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert("location_on_bus_schedule", [
			{
				bus_schedule_id: 2,
				bus_detail: '["Văn Phòng Mỹ Đình: 11:30","Văn Phòng Giáp Bát: 11:45", "Bến Xe Nước Ngầm: 12:15" ,"Văn Phòng Thanh Xuân:  12:45"]',
				bus_location_address:
					'["108 Trần Thái Tông, Dịch Vọng, Cầu Giấy, Hà Nội", "132 Trương Định, Giáp Bát, Hoàng Mai, Hà Nội" , "1 Đ. Ngọc Hồi, Hoàng Liệt, Hoàng Mai, Hà Nội" , "231C Đ. Nguyễn Trãi, Thanh Xuân Bắc, Thanh Xuân, Hà Nội"]',
				bus_location_type: 0,
			},
			{
				bus_schedule_id: 2,
				bus_detail: '["Văn Phòng Nam Định 13:30", "Văn Phòng Lê Hồng Phong: 13:50" , Văn Phòng Nghĩa Hưng: 14:20]',
				bus_location_address:
					'["272 Trần Hưng Đạo, Bà Triệu, TP. Nam Định, Nam Định", "76 Vị Xuyên, phường Vị Xuyên, Tp. Nam Định" , "Liễu Đề, Nghĩa Hưng, Nam Định"]',
				bus_location_type: 1,
			},

			{
				bus_schedule_id: 1,
				bus_detail: '["Văn Phòng Nghĩa Hưng: 07:30" , "Văn Phòng Lê Hồng Phong: 07:50" , "Văn Phòng Nam Định: 08:10"]',
				bus_location_address:
					'["Liễu Đề, Nghĩa Hưng, Nam Định" , "76 Vị Xuyên, phường Vị Xuyên, Tp. Nam Định" , "272 Trần Hưng Đạo, Bà Triệu, TP. Nam Định"]',
				bus_location_type: 0,
			},
			{
				bus_schedule_id: 2,
				bus_detail: '["Nghĩa Trang Mai Dịch: 09:20" , "Công Viên Cầu Giấy: 09:45" , "Văn Phòng Trần Vỹ: 10:08"]',
				bus_location_address:
					'["2QRC+42R, Đ. Hồ Tùng Mậu, Mai Dịch, Cầu Giấy, Hà Nội" , "Công Viên Cầu Giấy, P. Duy Tân, Dịch Vọng, Cầu Giấy, Hà Nội" , "Số 132 Phố, Trần Vỹ, Mai Dịch, Cầu Giấy, Hà Nội"]',
				bus_location_type: 1,
			},
		])

	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete("location_on_bus_schedule", null, {});
	},
};
