module.exports = (sequelize, Sequelize) => {
  const City = sequelize.define(
    'city',
    {
      id: {
        type: Sequelize.INTEGER(20),
        primaryKey: true,
        autoIncrement: true,
      },
      city_name: {
        type: Sequelize.STRING,
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
    }
  );

  return City;
};
