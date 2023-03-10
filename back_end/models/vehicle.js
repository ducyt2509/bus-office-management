module.exports = (sequelize, Sequelize) => {
  const Bus_type = sequelize.define(
    'vehicle',
    {
      id: {
        type: Sequelize.INTEGER(20).UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      vehicle_name: {
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

  return Bus_type;
};
