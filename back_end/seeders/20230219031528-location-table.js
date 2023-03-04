"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert("location", [
			{
				location_name: "Văn Phòng Mĩ Đình",
				city_id: 47,
			},
			{
				location_name: "Văn Phòng Giáp Bát",
				city_id: 47,
			},
			{
				location_name: "Số 1 đường Nguyễn Quý Đức",
				city_id: 47,
			},
			{
				location_name: "Số 1 đường Trần Vỹ",
				city_id: 47,
			},
			{
				location_name: "Văn phòng Thanh Xuân",
				city_id: 47,
			},
			{
				location_name: "Công Viên Cầu Giấy ",
				city_id: 47,
			},
			{
				location_name: "Nghĩa Trang Mai Dịch",
				city_id: 47,
			},
			{
				location_name: "Đại Học FPT",
				city_id: 47,
			},
			{
				location_name: "Số 1 đường Lê Hồng Phong",
				city_id: 14,
			},
		]);
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete("location", null, {});
	},
};
