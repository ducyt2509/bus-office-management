'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('user', [
      {
        user_name: 'Nguyễn Tiến Lộc',
        email: 'socmummim220401@gmail.com',
        password: '$2b$10$XUA.3ws6AleMgBJs7ebMJ.N5987UkAFnK8NYD7J45m/bqv96EvJJG',
        phone: '+84815647388',
        avatar: null,
        role_id: 1,
        office_id: 1,
      },
      {
        user_name: 'Trần Văn Đức',
        email: 'duclee025@gmail.com',
        password: '$2b$10$XUA.3ws6AleMgBJs7ebMJ.N5987UkAFnK8NYD7J45m/bqv96EvJJG',
        phone: '+84944321602',
        avatar: null,
        role_id: 1,
        office_id: 1,
      },
      {
        user_name: 'Lương Việt Thắng',
        email: 'vietthang1118@gmail.com',
        password: '$2b$10$XUA.3ws6AleMgBJs7ebMJ.N5987UkAFnK8NYD7J45m/bqv96EvJJG',
        phone: '+84353773551',
        avatar: null,
        role_id: 1,
        office_id: 1,
      },
      {
        user_name: 'Nguyễn Đình Phúc',
        email: 'dinhphucnguyen112@gmail.com',
        password: '$2b$10$XUA.3ws6AleMgBJs7ebMJ.N5987UkAFnK8NYD7J45m/bqv96EvJJG',
        phone: '+84985645681',
        avatar: 'null',
        role_id: 1,
        office_id: 1,
      },
      {
        user_name: 'Trịnh Diễm Quỳnh',
        email: 'caanxuong@gmail.com',
        password: '$2b$10$XUA.3ws6AleMgBJs7ebMJ.N5987UkAFnK8NYD7J45m/bqv96EvJJG',
        phone: '+84948530996',
        avatar: null,
        role_id: 2,
        office_id: 1,
      },
      {
        user_name: 'Nguyễn Thị Mồn Lèo',
        email: 'socmap220401@gmail.com',
        password: '$2b$10$XUA.3ws6AleMgBJs7ebMJ.N5987UkAFnK8NYD7J45m/bqv96EvJJG',
        phone: '+84$2b$10$XUA.3ws6AleMgBJs7ebMJ.N5987UkAFnK8NYD7J45m/bqv96EvJJG789',
        avatar: null,
        role_id: 2,
        office_id: 1,
      },
      {
        user_name: 'Nguyễn Tiến Cứt',
        email: 'socquekute220401@gmail.com',
        password: '$2b$10$XUA.3ws6AleMgBJs7ebMJ.N5987UkAFnK8NYD7J45m/bqv96EvJJG',
        phone: '+84987654321',
        avatar: null,
        role_id: 3,
        office_id: 1,
      },
      {
        user_name: 'Trịnh Diễm Mốc',
        email: 'vainglory220401@gmail.com',
        password: '$2b$10$XUA.3ws6AleMgBJs7ebMJ.N5987UkAFnK8NYD7J45m/bqv96EvJJG',
        phone: '+84678954321',
        avatar: null,
        role_id: 3,
        office_id: 1,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('user', null, {});
  },
};
