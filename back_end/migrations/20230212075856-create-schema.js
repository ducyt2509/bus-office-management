'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.createTable(
          'role',
          {
            id: {
              type: Sequelize.DataTypes.INTEGER(20).UNSIGNED,
              primaryKey: true,
              autoIncrement: true,
              allowNull: false,
            },
            role_name: {
              type: Sequelize.DataTypes.STRING,
              allowNull: false,
            },
          },
          { transaction: t, charset: 'utf8mb4', collate: 'utf8mb4_unicode_ci' }
        ),

        queryInterface.createTable(
          'city',
          {
            id: {
              type: Sequelize.DataTypes.INTEGER(20).UNSIGNED,
              primaryKey: true,
              autoIncrement: true,
              allowNull: false,
            },
            city_name: {
              type: Sequelize.DataTypes.STRING,
              allowNull: false,
            },
          },
          { transaction: t, charset: 'utf8mb4', collate: 'utf8mb4_unicode_ci' }
        ),
        queryInterface.createTable(
          'office',
          {
            id: {
              type: Sequelize.DataTypes.INTEGER(20).UNSIGNED,
              primaryKey: true,
              autoIncrement: true,
              allowNull: false,
            },
            office_name: {
              type: Sequelize.DataTypes.STRING,
              allowNull: false,
            },
            city_id: {
              type: Sequelize.DataTypes.INTEGER(20).UNSIGNED,
              allowNull: false,
              references: {
                model: {
                  tableName: 'city',
                },
                key: 'id',
              },
              onDelete: 'cascade',
            },
            office_address: {
              type: Sequelize.DataTypes.STRING,
              allowNull: false,
            },
          },
          { transaction: t, charset: 'utf8mb4', collate: 'utf8mb4_unicode_ci' }
        ),
        queryInterface.createTable(
          'vehicle',
          {
            id: {
              type: Sequelize.DataTypes.INTEGER(20).UNSIGNED,
              primaryKey: true,
              autoIncrement: true,
              allowNull: false,
            },
            vehicle_name: {
              type: Sequelize.DataTypes.STRING,
              allowNull: false,
            },
            office_id: {
              type: Sequelize.DataTypes.INTEGER(20).UNSIGNED,
              allowNull: false,
              references: {
                model: {
                  tableName: 'office',
                },
                key: 'id',
              },
              onDelete: 'cascade',
            },
          },
          { transaction: t, charset: 'utf8mb4', collate: 'utf8mb4_unicode_ci' }
        ),

        queryInterface.createTable(
          'location',
          {
            id: {
              type: Sequelize.DataTypes.INTEGER(20).UNSIGNED,
              primaryKey: true,
              autoIncrement: true,
              allowNull: false,
            },
            location_name: {
              type: Sequelize.DataTypes.STRING,
              allowNull: false,
            },
            address: {
              type: Sequelize.DataTypes.STRING,
            },
            city_id: {
              type: Sequelize.DataTypes.INTEGER(20).UNSIGNED,
              allowNull: false,
              references: {
                model: {
                  tableName: 'city',
                },
                key: 'id',
              },
              onDelete: 'cascade',
            },
          },
          { transaction: t, charset: 'utf8mb4', collate: 'utf8mb4_unicode_ci' }
        ),

        queryInterface.createTable(
          'route',
          {
            id: {
              type: Sequelize.DataTypes.INTEGER(20).UNSIGNED,
              primaryKey: true,
              autoIncrement: true,
              allowNull: false,
            },
            city_from_id: {
              type: Sequelize.DataTypes.INTEGER(20).UNSIGNED,
              allowNull: false,
              references: {
                model: {
                  tableName: 'city',
                },
                key: 'id',
              },
            },
            city_to_id: {
              type: Sequelize.DataTypes.INTEGER(20).UNSIGNED,
              allowNull: false,
              references: {
                model: {
                  tableName: 'city',
                },
                key: 'id',
              },
            },
          },
          { transaction: t, charset: 'utf8mb4', collate: 'utf8mb4_unicode_ci' }
        ),

        queryInterface.createTable(
          'user',
          {
            id: {
              type: Sequelize.DataTypes.INTEGER(20).UNSIGNED,
              primaryKey: true,
              autoIncrement: true,
              allowNull: false,
            },
            user_name: {
              type: Sequelize.DataTypes.STRING,
              allowNull: false,
            },
            email: {
              type: Sequelize.DataTypes.STRING,
              allowNull: false,
            },
            password: {
              type: Sequelize.DataTypes.STRING,
              allowNull: false,
            },
            phone: {
              type: Sequelize.DataTypes.STRING,
              allowNull: false,
            },
            avatar: {
              type: Sequelize.DataTypes.STRING,
              allowNull: true,
            },
            role_id: {
              type: Sequelize.DataTypes.INTEGER(20).UNSIGNED,
              allowNull: false,
              references: {
                model: {
                  tableName: 'role',
                },
                key: 'id',
              },
              onDelete: 'cascade',
            },
            office_id: {
              type: Sequelize.DataTypes.INTEGER(20).UNSIGNED,
              allowNull: false,
              references: {
                model: {
                  tableName: 'office',
                },
                key: 'id',
              },
              onDelete: 'cascade',
            },
            refresh_access_token: {
              type: Sequelize.DataTypes.STRING,
              allowNull: true,
            },
          },
          { transaction: t, charset: 'utf8mb4', collate: 'utf8mb4_unicode_ci' }
        ),

        queryInterface.createTable(
          'bus',
          {
            id: {
              type: Sequelize.DataTypes.INTEGER(20).UNSIGNED,
              primaryKey: true,
              autoIncrement: true,
              allowNull: false,
            },
            vehicle_plate: {
              type: Sequelize.DataTypes.STRING,
              allowNull: false,
            },
            main_driver_id: {
              type: Sequelize.DataTypes.INTEGER(20).UNSIGNED,
              allowNull: false,
              references: {
                model: {
                  tableName: 'user',
                },
                key: 'id',
              },
              onDelete: 'cascade',
            },
            support_driver_id: {
              type: Sequelize.DataTypes.INTEGER(20).UNSIGNED,
              references: {
                model: {
                  tableName: 'user',
                },
                key: 'id',
              },
              onDelete: 'cascade',
            },
            vehicle_id: {
              type: Sequelize.DataTypes.INTEGER(20).UNSIGNED,
              allowNull: false,
              references: {
                model: {
                  tableName: 'vehicle',
                },
                key: 'id',
              },
              onDelete: 'cascade',
            },
            vehicle_status: {
              type: Sequelize.DataTypes.INTEGER(2),
              allowNull: false,
              defaultValue: 1,
            },
          },
          { transaction: t, charset: 'utf8mb4', collate: 'utf8mb4_unicode_ci' }
        ),

        queryInterface.createTable(
          'bus_schedule',
          {
            id: {
              type: Sequelize.DataTypes.INTEGER(20).UNSIGNED,
              primaryKey: true,
              autoIncrement: true,
              allowNull: false,
            },
            bus_id: {
              type: Sequelize.DataTypes.INTEGER(20).UNSIGNED,
              allowNull: false,
              references: {
                model: {
                  tableName: 'bus',
                },
                key: 'id',
              },
              onDelete: 'cascade',
            },
            route_id: {
              type: Sequelize.DataTypes.INTEGER(20).UNSIGNED,
              allowNull: false,
              references: {
                model: {
                  tableName: 'route',
                },
                key: 'id',
              },
              onDelete: 'cascade',
            },
            price: {
              type: Sequelize.DataTypes.DOUBLE,
              allowNull: false,
            },
            time_from: {
              type: Sequelize.DataTypes.STRING,
              allowNull: false,
            },
            travel_time: {
              type: Sequelize.DataTypes.INTEGER(20),
              allowNull: false,
            },
            date_start: {
              type: Sequelize.DataTypes.DATE,
              allowNull: false,
            },
            bus_schedule_status: {
              type: Sequelize.DataTypes.INTEGER(20),
              allowNull: false,
            },
            schedule_frequency: {
              type: Sequelize.DataTypes.INTEGER(20),
              allowNull: false,
            },
            bus_schedule_expire: {
              type: Sequelize.DataTypes.INTEGER(20),
            },
          },
          { transaction: t, charset: 'utf8mb4', collate: 'utf8mb4_unicode_ci' }
        ),
        queryInterface.createTable(
          'transaction',
          {
            id: {
              type: Sequelize.DataTypes.INTEGER(20).UNSIGNED,
              primaryKey: true,
              autoIncrement: true,
              allowNull: false,
            },
            vehicle_id: {
              type: Sequelize.DataTypes.INTEGER(20).UNSIGNED,
              allowNull: false,
              references: {
                model: {
                  tableName: 'vehicle',
                },
                key: 'id',
              },
              onDelete: 'cascade',
            },
            passenger_name: {
              type: Sequelize.DataTypes.STRING,
            },
            passenger_phone: {
              type: Sequelize.DataTypes.STRING,
            },
            pickup_location_id: {
              type: Sequelize.DataTypes.INTEGER(20).UNSIGNED,
              allowNull: false,
              references: {
                model: {
                  tableName: 'location',
                },
                key: 'id',
              },
              onDelete: 'cascade',
            },
            drop_off_location_id: {
              type: Sequelize.DataTypes.INTEGER(20).UNSIGNED,
              allowNull: false,
              references: {
                model: {
                  tableName: 'location',
                },
                key: 'id',
              },
              onDelete: 'cascade',
            },
            tranship_address: {
              type: Sequelize.DataTypes.TEXT,
              allowNull: false,
            },
            date_detail: {
              type: Sequelize.DataTypes.STRING,
              allowNull: false,
            },
            route_id: {
              type: Sequelize.DataTypes.INTEGER(20).UNSIGNED,
              allowNull: false,
              references: {
                model: {
                  tableName: 'route',
                },
                key: 'id',
              },
              onDelete: 'cascade',
            },
            cashier: {
              type: Sequelize.DataTypes.INTEGER(20).UNSIGNED,
              allowNull: false,
              references: {
                model: {
                  tableName: 'user',
                },
                key: 'id',
              },
              onDelete: 'cascade',
            },
            ticket_price: {
              type: Sequelize.DataTypes.DOUBLE,
              allowNull: false,
            },
            created_at: {
              type: Sequelize.DataTypes.DATE,
              allowNull: false,
            },
            created_by: {
              type: Sequelize.DataTypes.INTEGER(20).UNSIGNED,
              allowNull: false,
              references: {
                model: {
                  tableName: 'user',
                },
                key: 'id',
              },
              onDelete: 'cascade',
            },
            created_on: {
              type: Sequelize.DataTypes.DATE,
              allowNull: false,
            },
            payment_status: {
              type: Sequelize.DataTypes.INTEGER,
              allowNull: false,
            },
            seat: {
              type: Sequelize.DataTypes.STRING,
              allowNull: false,
            },
          },
          { transaction: t, charset: 'utf8mb4', collate: 'utf8mb4_unicode_ci' }
        ),
        queryInterface.createTable(
          'ticket',
          {
            id: {
              type: Sequelize.DataTypes.INTEGER(20).UNSIGNED,
              primaryKey: true,
              autoIncrement: true,
              allowNull: false,
            },
            transaction_id: {
              type: Sequelize.DataTypes.INTEGER(20).UNSIGNED,
              allowNull: false,
              references: {
                model: {
                  tableName: 'transaction',
                },
                key: 'id',
              },
              onDelete: 'cascade',
            },
          },
          { transaction: t, charset: 'utf8mb4', collate: 'utf8mb4_unicode_ci' }
        ),
        queryInterface.createTable(
          'daily_bus_schedule',
          {
            id: {
              type: Sequelize.DataTypes.INTEGER(20).UNSIGNED,
              primaryKey: true,
              autoIncrement: true,
              allowNull: false,
            },
            // tình trạng xuất bến
            departure_status: {
              type: Sequelize.DataTypes.INTEGER(20),
            },
            date: {
              type: Sequelize.DataTypes.DATE,
            },
            bus_schedule_id: {
              type: Sequelize.DataTypes.INTEGER(20).UNSIGNED,
              allowNull: false,
              references: {
                model: {
                  tableName: 'bus_schedule',
                },
                key: 'id',
              },
              onDelete: 'cascade',
            },
          },
          { transaction: t, charset: 'utf8mb4', collate: 'utf8mb4_unicode_ci' }
        ),
      ]);
    });
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.dropTable('role', { transaction: t }),
      queryInterface.dropTable('city', { transaction: t }),
      queryInterface.dropTable('vehicle', { transaction: t }),
      queryInterface.dropTable('location', { transaction: t }),
      queryInterface.dropTable('route', { transaction: t }),
      queryInterface.dropTable('user', { transaction: t }),
      queryInterface.dropTable('bus', { transaction: t }),
      queryInterface.dropTable('bus_schedule', { transaction: t }),
      queryInterface.dropTable('daily_bus_schedule', { transaction: t }),
      queryInterface.dropTable('office', { transaction: t }),
      queryInterface.dropTable('transaction', { transaction: t }),
      queryInterface.dropTable('ticket', { transaction: t }),
    ]);
  },
};
