'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('city', [
      {
        city_name: 'An Giang',
      },
      {
        city_name: 'Kon Tum',
      },
      {
        city_name: 'Bà Rịa – Vũng Tàu',
      },
      {
        city_name: 'Lai Châu',
      },
      {
        city_name: 'Bắc Giang',
      },
      {
        city_name: 'Lâm Đồng',
      },
      {
        city_name: 'Bắc Kạn',
      },
      {
        city_name: 'Lạng Sơn',
      },
      {
        city_name: 'Bạc Liêu',
      },
      {
        city_name: 'Lào Cai',
      },
      {
        city_name: 'Bắc Ninh',
      },
      {
        city_name: 'Long An',
      },
      {
        city_name: 'Bến Tre',
      },
      {
        city_name: 'Nam Định',
      },
      {
        city_name: 'Bình Định',
      },
      {
        city_name: 'Nghệ An',
      },
      {
        city_name: 'Bình Dương',
      },
      {
        city_name: 'Ninh Bình',
      },
      {
        city_name: 'Bình Phước',
      },
      {
        city_name: 'Ninh Thuận',
      },
      {
        city_name: 'Bình Thuận',
      },
      {
        city_name: 'Phú Thọ',
      },
      {
        city_name: 'Cà Mau',
      },
      {
        city_name: 'Phú Yên',
      },
      {
        city_name: 'Cần Thơ',
      },
      {
        city_name: 'Quảng Bình',
      },
      {
        city_name: 'Cao Bằng',
      },
      {
        city_name: 'Quảng Nam',
      },
      {
        city_name: 'Đà Nẵng',
      },
      {
        city_name: 'Quảng Ngãi',
      },
      {
        city_name: 'Đắk Lắk',
      },
      {
        city_name: 'Quảng Ninh',
      },
      {
        city_name: 'Đắk Nông',
      },
      {
        city_name: 'Quảng Trị',
      },
      {
        city_name: 'Điện Biên',
      },
      {
        city_name: 'Sóc Trăng',
      },
      {
        city_name: 'Đồng Nai',
      },
      {
        city_name: 'Sơn La',
      },
      {
        city_name: 'Đồng Tháp',
      },
      {
        city_name: 'Tây Ninh',
      },
      {
        city_name: 'Gia Lai',
      },
      {
        city_name: 'Thái Bình',
      },
      {
        city_name: 'Hà Giang',
      },
      {
        city_name: 'Thái Nguyên',
      },
      {
        city_name: 'Hà Nam',
      },
      {
        city_name: 'Thanh Hóa',
      },
      {
        city_name: 'Hà Nội',
      },
      {
        city_name: 'Thừa Thiên Huế',
      },
      {
        city_name: 'Hà Tĩnh',
      },
      {
        city_name: 'Tiền Giang',
      },
      {
        city_name: 'Hải Dương',
      },
      {
        city_name: 'TP Hồ Chí Minh',
      },
      {
        city_name: 'Hải Phòng',
      },
      {
        city_name: 'Trà Vinh',
      },
      {
        city_name: 'Hậu Giang',
      },
      {
        city_name: 'Tuyên Quang',
      },
      {
        city_name: 'Hòa Bình',
      },
      {
        city_name: 'Vĩnh Long',
      },
      {
        city_name: 'Hưng Yên',
      },
      {
        city_name: 'Vĩnh Phúc',
      },
      {
        city_name: 'Khánh Hòa',
      },
      {
        city_name: 'Yên Bái',
      },
      {
        city_name: 'Kiên Giang',
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('city', null, {});
  },
};
