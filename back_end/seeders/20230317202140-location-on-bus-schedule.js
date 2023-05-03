'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('location_on_bus_schedule', [
      //0 Đón , 1 TRẢ
      {
        bus_schedule_id: 1,
        bus_detail: '["Văn Phòng Mỹ Đình: 07:30","Văn Phòng Giáp Bát: 08:10"  ]',
        bus_location_address:
          '["108 Trần Thái Tông, Dịch Vọng, Cầu Giấy, Hà Nội", "132 Trương Định, Giáp Bát, Hoàng Mai, Hà Nội"]',
        bus_location_type: 0,
      },
      {
        bus_schedule_id: 1,
        bus_detail:
          '["Văn Phòng Nam Định: 9h15 " , "Văn Phòng Lê Hồng Phong: 9h35" , "Văn Phòng Nghĩa Hưng: 10:00"]',
        bus_location_address:
          '["272 Trần Hưng Đạo, Bà Triệu, TP. Nam Định", "176 Vị Xuyên, phường Vị Xuyên, Tp. Nam Định" , "Liễu Đề, Nghĩa Hưng, Nam Định"]',
        bus_location_type: 1,
      },

      {
        bus_schedule_id: 2,
        bus_detail:
          '["Văn Phòng Trần Vỹ: 12:05","Văn Phòng Mỹ Đình: 12:15" , "Văn Phòng Giáp Bát: 13:10" ]',
        bus_location_address:
          '["Số 132 Phố, Trần Vỹ, Mai Dịch, Cầu Giấy, Hà Nội", "108 Trần Thái Tông, Dịch Vọng, Cầu Giấy, Hà Nội" , "132 Trương Định, Giáp Bát, Hoàng Mai, Hà Nội"]',
        bus_location_type: 0,
      },
      {
        bus_schedule_id: 2,
        bus_detail:
          '["Văn Phòng Nam Định: 14:20 " , "Văn Phòng Lê Hồng Phong: 14:50" , "Văn Phòng Nghĩa Hưng: 15:00"]',
        bus_location_address:
          '["272 Trần Hưng Đạo, Bà Triệu, TP. Nam Định", "176 Vị Xuyên, phường Vị Xuyên, Tp. Nam Định" , "Liễu Đề, Nghĩa Hưng, Nam Định"]',
        bus_location_type: 1,
      },

      {
        bus_schedule_id: 3,
        bus_detail:
          '["Văn Phòng Mỹ Đình: 16:35" , "Bến Xe Nước Ngầm: 17:05" , "Văn Phòng Thanh Xuân: 17:20"  ]',
        bus_location_address:
          '["108 Trần Thái Tông, Dịch Vọng, Cầu Giấy, Hà Nội", "1 Đ. Ngọc Hồi, Hoàng Liệt, Hoàng Mai, Hà Nội" , "231C Đ. Nguyễn Trãi, Thanh Xuân Bắc, Thanh Xuân, Hà Nội"]',
        bus_location_type: 0,
      },
      {
        bus_schedule_id: 3,
        bus_detail:
          '["Văn Phòng Nam Định: 18:30" , "Văn Phòng Lê Hồng Phong: 18:50" , "Văn Phòng Nghĩa Hưng: 19:25"]',
        bus_location_address:
          '["272 Trần Hưng Đạo, Bà Triệu, TP. Nam Định", "176 Vị Xuyên, phường Vị Xuyên, Tp. Nam Định" , "Liễu Đề, Nghĩa Hưng, Nam Định"]',
        bus_location_type: 1,
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('location_on_bus_schedule', null, {});
  },
};
