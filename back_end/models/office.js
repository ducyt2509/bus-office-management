module.exports = (sequelize, Sequelize) => {
  const Office = sequelize.define(
    'office',
    {
      id: {
        type: Sequelize.INTEGER(20).UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      office_name: {
        type: Sequelize.STRING,
      },
      office_address: {
        type: Sequelize.STRING,
      },
      user_id: {
        type: Sequelize.INTEGER(20).UNSIGNED,
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
    }
  );

  return Office;
};
