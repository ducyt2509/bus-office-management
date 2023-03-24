"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert("office", [
			{
				office_name: "Văn Phòng Mỹ Đình",
				office_address: "108 Trần Thái Tông, Dịch Vọng, Cầu Giấy, Hà Nội",
				city_id: 47,
			},
			{
				office_name: "Văn Phòng Giáp Bát",
				office_address: "132 Trương Định, Giáp Bát, Hoàng Mai, Hà Nội",
				city_id: 47,
			},
			{
				office_name: "Văn Phòng Nam Định",
				office_address: "272 Trần Hưng Đạo, Bà Triệu, TP. Nam Định, Nam Định",
				city_id: 14,
			},
			{
				office_name: "Văn Phòng Thái Hòa",
				office_address: "169 Lý Thường Kiệt, Quang Tiến, TX. Thái Hòa, Nghệ An",
				city_id: 16,
			},
			{
				office_name: "Văn Phòng Vinh",
				office_address: "325 Lê Duẩn, Trường Thi, Thành phố Vinh, Nghệ An",
				city_id: 16,
			},
			{
				office_name: "Văn phòng Hạ Long",
				office_address: "412 Vũ Văn Hiếu, Hà Tu, Thành phố Hạ Long, Quảng Ninh",
				city_id: 32,
			},
			{
				office_name: "Văn phòng Hưng Yên",
				office_address: "15 Lương Văn Can, P. Lam Sơn, Hưng Yên, Việt Nam",
				city_id: 59,
			},
			//   { vehicle_name: '12 chỗ', office_id: 1 },
			//   { vehicle_name: '16 chỗ', office_id: 1 },
			//   { vehicle_name: '29 chỗ', office_id: 1 },
			//   { vehicle_name: '35 chỗ', office_id: 1 },
			//   { vehicle_name: '45 chỗ', office_id: 1 },
		]);
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete("office", null, {});
	},
};
