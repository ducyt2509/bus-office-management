'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.createTable('user', {
          id: {
            type: Sequelize.DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true,
          },
          email: {
            type: Sequelize.DataTypes.STRING(300),
          },
          password: {
            type: Sequelize.DataTypes.STRING(300),
          },
        }),
      ]);
    });
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([queryInterface.dropTable('user')]);
  },
};
