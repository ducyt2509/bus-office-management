module.exports = (sequelize, Sequelize) => {
  const Bus = sequelize.define(
    'bus',
    {
      id: {
        type: Sequelize.INTEGER(20).UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      bus_plate: {
        type: Sequelize.STRING,
      },
      main_driver_id: {
        type: Sequelize.INTEGER(20).UNSIGNED,
      },
      support_driver_id: {
        type: Sequelize.INTEGER(20).UNSIGNED,
      },
      bus_type_id: {
        type: Sequelize.INTEGER(20).UNSIGNED,
      },
      bus_status: {
        type: Sequelize.INTEGER(2),
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
    }
  );

  return Bus;
};
