module.exports = (sequelize, Sequelize) => {
  const Role = sequelize.define(
    'role',
    {
      id: {
        type: Sequelize.INTEGER(20),
        primaryKey: true,
        autoIncrement: true,
      },
      role_name: {
        type: Sequelize.STRING,
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
    }
  );

  return Role;
};
