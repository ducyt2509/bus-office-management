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
      city_id: {
        type: Sequelize.INTEGER(20).UNSIGNED,
      },
      office_address: {
        type: Sequelize.STRING,
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
    }
  );

  return Office;
};
