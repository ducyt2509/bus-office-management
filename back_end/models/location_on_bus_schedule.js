module.exports = (sequelize, Sequelize) => {
  const Bus_schedule = sequelize.define(
    'location_on_bus_schedule',
    {
      id: {
        type: Sequelize.INTEGER(20).UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      bus_detail: {
        type: Sequelize.STRING,
      },
      bus_location_type: {
        type: Sequelize.INTEGER(20).UNSIGNED,
      },
      bus_schedule_id: {
        type: Sequelize.INTEGER(20).UNSIGNED,
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
    }
  );

  return Bus_schedule;
};
