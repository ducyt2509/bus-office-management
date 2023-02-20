module.exports = (sequelize, Sequelize) => {
  const Ticket = sequelize.define(
    'ticket',
    {
      id: {
        type: Sequelize.INTEGER(20).UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      transaction_id: {
        type: Sequelize.INTEGER(20).UNSIGNED,
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
    }
  );

  return Ticket;
};
