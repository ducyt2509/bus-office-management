module.exports = (sequelize, Sequelize) => {
  const Bus_schedule = sequelize.define(
    'daily_bus_schedule',
    {
      id: {
        type: Sequelize.INTEGER(20).UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      departure_status: {
        type: Sequelize.INTEGER(20),
      },
      date: {
        type: Sequelize.DATE,
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
