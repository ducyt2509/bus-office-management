module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    'user',
    {
      id: {
        type: Sequelize.INTEGER(20).UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      user_name: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
      },
      phone: {
        type: Sequelize.STRING,
      },
      avatar: {
        type: Sequelize.STRING,
      },
      role_id: {
        type: Sequelize.INTEGER(20).UNSIGNED,
      },
      refresh_access_token: {
        type: Sequelize.STRING,
      },
      office_id: {
        type: Sequelize.INTEGER(20).UNSIGNED,
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
    }
  );

  return User;
};
