module.exports = (sequelize, Sequelize) => {
  const Transaction = sequelize.define(
    'transaction',
    {
      id: {
        type: Sequelize.INTEGER(20).UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      passenger_name: {
        type: Sequelize.STRING,
      },
      passenger_phone: {
        type: Sequelize.STRING,
      },
      passenger_email: {
        type: Sequelize.STRING,
      },
      note: {
        type: Sequelize.STRING,
      },
      cashier: {
        type: Sequelize.INTEGER(20),
      },
      pickup_location: {
        type: Sequelize.STRING,
      },
      drop_off_location: {
        type: Sequelize.STRING,
      },
      date_detail: {
        type: Sequelize.STRING,
      },
      ticket_price: {
        type: Sequelize.DOUBLE,
      },
      created_at: {
        type: Sequelize.DATE,
      },
      created_by: {
        type: Sequelize.INTEGER(20).UNSIGNED,
      },
      payment_status: {
        type: Sequelize.INTEGER,
      },
      seat: {
        type: Sequelize.STRING,
      },
      transport_id: {
        type: Sequelize.INTEGER(20),
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
    }
  );

  return Transaction;
};
