'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('payment_status', [
      {
      payment_status_name: "Chưa thanh toán"
      },
      {
        payment_status_name:"Đã thanh toán"
      },
      {
        payment_status_name: "Thanh toán khi lên xe"
      },
      {
        payment_status_name: "Huỷ vé"
      }
  ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('payment_status', null, {});
  }
};
