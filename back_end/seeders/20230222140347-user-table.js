'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('user', [
      {
        user_name: 'Nguyễn Tiến Lộc',
        email: 'socmummim220401@gmail.com',
        password: 'NL123456',
        phone: '+84815647388',
        avatar: null,
        role_id: 1,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('user', null, {});
  },
};
