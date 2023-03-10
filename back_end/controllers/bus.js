const db = require('../models');
const Bus = db.buses;
const User = db.users;
const Vehicle = db.vehicles;
const Op = db.Sequelize.Op;
const responseHandler = require('../handlers/response.handler');

module.exports = {
  async addNewBus(req, res) {
    const params = req.body;
    try {
      const createBus = await Bus.create(params);
      if (createBus) {
        return responseHandler.ok(res, 'Add bus successful!');
      } else {
        return responseHandler.responseWithData(res, 403, { message: "Can't create add bus" });
      }
    } catch (error) {
      return responseHandler.badRequest(res, error.message);
    }
  },

  async deleteBus(req, res) {
    const params = req.body;
    const bus_id = params.id;
    try {
      const deleteBus = await Bus.destroy({
        where: {
          id: bus_id,
        },
      });
      if (deleteBus) {
        return responseHandler.ok(res, 'Delete bus successful!');
      } else {
        return responseHandler.responseWithData(res, 403, { message: "Can't delete bus" });
      }
    } catch (error) {
      return responseHandler.badRequest(res, error.message);
    }
  },

  async getListBus(req, res) {
    const params = req.body;
    const limit = params.limit;
    const offset = params.offset;
    const querySearch = params.query_search;
    const bus_plate = params.bus_plate;
    const bus_type_id = params.bus_type_id;

    try {
      const include = querySearch
        ? [
            {
              model: User,
              where: {
                user_name: {
                  [Op.like]: `%${querySearch}%`,
                },
              },
            },
          ]
        : [];
      const whereCondition = {};
      if (bus_plate) {
        whereCondition['bus_plate'] = { [Op.like]: `%${bus_plate}%` };
      }
      if (bus_type_id) {
        whereCondition['bus_type_id'] = bus_type_id;
      }
      let [getListBus, numberBus] = await Promise.all([
        Bus.findAll({
          include: include,
          where: whereCondition,
          limit: limit,
          offset: offset,
        }),
        Bus.count({
          where: whereCondition,
          include: include,
        }),
      ]);
      if (getListBus) {
        for (let i = 0; i < getListBus.length; i++) {
          const [getDriverMain, getDriverSupport, getVehicle] = await Promise.all([
            User.findOne({
              where: {
                id: getListBus[i].main_driver_id,
              },
            }),
            User.findOne({
              where: {
                id: getListBus[i].support_driver_id,
              },
            }),
            Vehicle.findOne({
              where: {
                id: getListBus[i].vehicle_id,
              },
            }),
          ]);
          if (getDriverMain) {
            delete getDriverMain.dataValues.password;
            delete getDriverMain._previousDataValues.password;
            delete getDriverMain.dataValues.refresh_access_token;
            delete getDriverMain._previousDataValues.refresh_access_token;
            getListBus[i].dataValues.driverMain = getDriverMain;
          }
          if (getDriverSupport) {
            delete getDriverSupport.dataValues.password;
            delete getDriverSupport._previousDataValues.password;
            delete getDriverSupport.dataValues.refresh_access_token;
            delete getDriverSupport._previousDataValues.refresh_access_token;
            getListBus[i].dataValues.driverSupport = getDriverSupport;
          }
          if (getVehicle) {
            getListBus[i].dataValues.vehicle = getVehicle;
          }
        }
        return responseHandler.responseWithData(res, 200, {
          list_bus: getListBus,
          number_bus: numberBus,
        });
      } else {
        return responseHandler.responseWithData(res, 403, { message: "Can't get list bus" });
      }
    } catch (error) {
      return responseHandler.badRequest(res, error.message);
    }
  },

  async getInformationBus(req, res) {
    const params = req.body;
    const bus_id = params.id;
    try {
      const getBusById = await Bus.findOne({
        where: {
          id: bus_id,
        },
      });
      if (getBusById) {
        return responseHandler.responseWithData(res, 200, getBusById);
      } else {
        return responseHandler.responseWithData(res, 403, { message: "Can't get bus information" });
      }
    } catch (error) {
      return responseHandler.badRequest(res, error.message);
    }
  },

  async updateBusInformation(req, res) {
    const params = req.body;
    try {
      const updateBus = await Bus.update(params, {
        where: {
          id: params.id,
        },
      });
      if (updateBus) {
        return responseHandler.ok(res, { message: 'Update bus successful!' });
      } else {
        return responseHandler.responseWithData(res, 403, {
          message: "Can't update bus information",
        });
      }
    } catch (error) {
      return responseHandler.badRequest(res, error.message);
    }
  },
};
