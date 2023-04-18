'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('location', [
      {
        location_name: 'Văn Phòng Mỹ Đình',
        address: '108 Trần Thái Tông, Dịch Vọng, Cầu Giấy, Hà Nội',
        city_id: 47,
      },
      {
        location_name: 'Văn Phòng Giáp Bát',
        address: '132 Trương Định, Giáp Bát, Hoàng Mai, Hà Nội',
        city_id: 47,
      },
      {
        location_name: 'Bến Xe Nước Ngầm',
        address: '1 Đ. Ngọc Hồi, Hoàng Liệt, Hoàng Mai, Hà Nội',
        city_id: 47,
      },
      {
        location_name: 'Văn Phòng Trần Vỹ',
        address: 'Số 132 Phố, Trần Vỹ, Mai Dịch, Cầu Giấy, Hà Nội',
        city_id: 47,
      },
      {
        location_name: 'Văn Phòng Thanh Xuân',
        address: '231C Đ. Nguyễn Trãi, Thanh Xuân Bắc, Thanh Xuân, Hà Nội',
        city_id: 47,
      },
      {
        location_name: 'Công Viên Cầu Giấy',
        address: 'Công Viên Cầu Giấy, P. Duy Tân, Dịch Vọng, Cầu Giấy, Hà Nội',
        city_id: 47,
      },
      {
        location_name: 'Nghĩa Trang Mai Dịch',
        address: '2QRC+42R, Đ. Hồ Tùng Mậu, Mai Dịch, Cầu Giấy, Hà Nội',
        city_id: 47,
      },
      {
        location_name: 'Đại Học FPT',
        address: 'Đất Thổ Cư Hòa Lạc, Km29 Đường Cao Tốc 08, Thạch Hoà, Thạch Thất, Hà Nội',
        city_id: 47,
      },
      {
        location_name: 'Văn Phòng Nam Định',
        address: '272 Trần Hưng Đạo, Bà Triệu, TP. Nam Định',
        city_id: 14,
      },

      {
        location_name: 'Văn Phòng Lê Hồng Phong',
        address: '76 Vị Xuyên, phường Vị Xuyên, Tp. Nam Định',
        city_id: 14,
      },

      {
        location_name: 'Văn Phòng Nghĩa Hưng',
        address: 'Liễu Đề, Nghĩa Hưng, Nam Định',
        city_id: 14,
      },
      {
        location_name: 'Văn Phòng Thái Hòa',
        address: '169 Lý Thường Kiệt, Quang Tiến, TX. Thái Hòa, Nghệ An',
        city_id: 16,
      },
      {
        location_name: 'Văn Phòng Vinh',
        address: '325 Lê Duẩn, Trường Thi, Thành phố Vinh, Nghệ An',
        city_id: 16,
      },
      {
        location_name: 'Điểm dừng xe buýt Đại học Vinh',
        address: '182 Lê Duẩn, Bến Thủy, Thành phố Vinh, Nghệ An, Việt Nam',
        city_id: 16,
      },
      {
        location_name: 'Văn phòng Hạ Long',
        address: '412 Vũ Văn Hiếu, Hà Tu, Thành phố Hạ Long, Quảng Ninh',
        city_id: 32,
      },
      {
        location_name: 'Văn phòng Uông Bí',
        address: '50 Trần Phú, Quang Trung, Uông Bí, Quảng Ninh',
        city_id: 32,
      },
      {
        location_name: 'Văn phòng Móng Cái',
        address: '47 Hùng Vương, P. Trần Phú, Móng Cái, Quảng Ninh',
        city_id: 32,
      },
      {
        location_name: 'Văn phòng Hưng Yên',
        address: '15 Lương Văn Can, P. Lam Sơn, Hưng Yên, Việt Nam',
        city_id: 59,
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('location', null, {});
  },
};
