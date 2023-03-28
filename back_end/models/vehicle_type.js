module.exports = (sequelize, Sequelize) => {
  const Vehicle_Type = sequelize.define(
    'vehicle_type',
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

  return Vehicle_Type;
};
