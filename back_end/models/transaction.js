module.exports = (sequelize, Sequelize) => {
  const Transaction = sequelize.define(
    'transaction',
    {
      id: {
        type: Sequelize.INTEGER(20).UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      vehicle_id: {
        type: Sequelize.INTEGER(20).UNSIGNED,
      },
      passenger_name: {
        type: Sequelize.STRING,
      },
      passenger_phone: {
        type: Sequelize.STRING,
      },
      cashier: {
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
      created_at: {
        type: Sequelize.DATE,
      },
      created_by: {
        type: Sequelize.INTEGER(20).UNSIGNED,
      },
      created_on: {
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
