module.exports = (sequelize, Sequelize) => {
  const Bus_schedule = sequelize.define(
    'transport',
    {
      id: {
        type: Sequelize.INTEGER(20).UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      bus_schedule_id: {
        type: Sequelize.INTEGER(20).UNSIGNED,
      },
      bus_id: {
        type: Sequelize.INTEGER(20).UNSIGNED,
      },
      departure_date: {
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
