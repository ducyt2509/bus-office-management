module.exports = (sequelize, Sequelize) => {
  const Bus_schedule = sequelize.define(
    'bus_schedule_daily',
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
    },
    {
      timestamps: false,
      freezeTableName: true,
    }
  );

  return Bus_schedule;
};
