module.exports = (sequelize, Sequelize) => {
  const Bus_type = sequelize.define(
    'bus_type',
    {
      id: {
        type: Sequelize.INTEGER(20).UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      bus_type_name: {
        type: Sequelize.STRING,
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
    }
  );

  return Bus_type;
};
