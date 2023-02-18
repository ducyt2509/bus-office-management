'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('role', [
      {
      role_name: "manage"
      },
      {
        role_name:"customer_service_staff"
      },
      {
        role_name: "driver"
      }
  ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('role', null, {});
  }
};
