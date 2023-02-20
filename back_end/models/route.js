module.exports = (sequelize, Sequelize) => {
  const Route = sequelize.define(
    'route',
    {
      id: {
        type: Sequelize.INTEGER(20).UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      city_from_id: {
        type: Sequelize.INTEGER(20).UNSIGNED,
      },
      city_to_id: {
        type: Sequelize.INTEGER(20).UNSIGNED,
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
    }
  );

  return Route;
};
