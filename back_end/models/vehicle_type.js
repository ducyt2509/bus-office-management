module.exports = (sequelize, Sequelize) => {
  const Bus_type = sequelize.define(
    'vehicle',
    {
      id: {
        type: Sequelize.INTEGER(20).UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      vehicle_type_name: {
        type: Sequelize.STRING,
      },
      number_seat: {
        type: Sequelize.INTEGER(20),
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
    }
  );

  return Bus_type;
};
