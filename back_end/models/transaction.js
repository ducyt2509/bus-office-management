module.exports = (sequelize, Sequelize) => {
  const Transaction = sequelize.define(
    'transaction',
    {
      id: {
        type: Sequelize.INTEGER(20).UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      bus_type_id: {
        type: Sequelize.INTEGER(20).UNSIGNED,
      },
      user_id: {
        type: Sequelize.INTEGER(20).UNSIGNED,
      },
      pickup_location_id: {
        type: Sequelize.INTEGER(20).UNSIGNED,
      },
      drop_off_location_id: {
        type: Sequelize.INTEGER(20).UNSIGNED,
      },
      tranship_address: {
        type: Sequelize.TEXT,
      },
      date_detail: {
        type: Sequelize.STRING,
      },
      route_id: {
        type: Sequelize.INTEGER(20).UNSIGNED,
      },
      ticket_price: {
        type: Sequelize.DOUBLE,
      },
      transaction_created_at: {
        type: Sequelize.DATE,
      },
      transaction_created_by: {
        type: Sequelize.INTEGER(20).UNSIGNED,
      },
      transaction_on: {
        type: Sequelize.DATE,
      },
      payment_status: {
        type: Sequelize.INTEGER,
      },
      seat: {
        type: Sequelize.STRING,
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
    }
  );

  return Transaction;
};
