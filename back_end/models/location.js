module.exports = (sequelize, Sequelize) => {
  const Location = sequelize.define(
    'location',
    {
      id: {
        type: Sequelize.INTEGER(20).UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      location_name: {
        type: Sequelize.STRING,
      },
      city_id: {
        type: Sequelize.INTEGER(20).UNSIGNED,
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
    }
  );

  return Location;
};
