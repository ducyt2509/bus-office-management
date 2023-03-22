"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert("location", [
			{
				location_name: "Văn Phòng Mĩ Đình",
				address: "Mỹ Đình Hà Nội",
				city_id: 47,
			},
			{
				location_name: "Văn Phòng Giáp Bát",
				address: "Giáp Bát Hà Nội",
				city_id: 47,
			},
			{
				location_name: "Số 1 đường Nguyễn Quý Đức",
				address: "Số 1 đường Nguyễn Quý Đức, HBT Hà Nội",
				city_id: 47,
			},
			{
				location_name: "Số 1 đường Trần Vỹ",
				address: "Số 1 đường Trần Vỹ, HBT Hà Nội",
				city_id: 47,
			},
			{
				location_name: "Văn phòng Thanh Xuân",
				address: "Thanh Xuân, HBT Hà Nội",
				city_id: 47,
			},
			{
				location_name: "Công Viên Cầu Giấy ",
				address: "Cầu Giấy, Hà Nội",
				city_id: 47,
			},
			{
				location_name: "Nghĩa Trang Mai Dịch",
				address: "Mai Dịch, Hà Nội",
				city_id: 47,
			},
			{
				location_name: "Đại Học FPT",
				address: "Công nghê cao Hoà Lac, Hà Nội",
				city_id: 47,
			},
			{
				location_name: "Số 1 đường Lê Hồng Phong",
				address: "Số 1 đường Lê Hồng Phong, HBT Hà Nội",
				city_id: 14,
			},
		]);
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete("location", null, {});
	},
};
