module.exports = (sequelize, Sequelize) => {
  const Bus_schedule = sequelize.define(
    'bus_schedule',
    {
      id: {
        type: Sequelize.INTEGER(20).UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      bus_id: {
        type: Sequelize.INTEGER(20).UNSIGNED,
      },
      route_id: {
        type: Sequelize.INTEGER(20).UNSIGNED,
      },
      price: {
        type: Sequelize.DOUBLE,
      },
      time_form: {
        type: Sequelize.DATE,
      },
      time_to: {
        type: Sequelize.DATE,
      },
      date_start: {
        type: Sequelize.DATE,
      },
      bus_schedule_status: {
        type: Sequelize.INTEGER(20),
      },
      schedule_frequency: {
        type: Sequelize.INTEGER(20),
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
    }
  );

  return Bus_schedule;
};
