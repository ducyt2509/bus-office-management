const db = require('../models');
const Bus = db.buses;
const User = db.users;
const Vehicle = db.vehicles;
const Op = db.Sequelize.Op;
const QueryTypes = db.Sequelize.QueryTypes;
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
    const limit = !params?.limit ? 7 : params.limit;
    const offset = !params?.offset ? 0 : params.offset;
    const querySearch = !params?.query_search ? '' : params.query_search;
    try {
      const querySQL = `select bus.id, bus.vehicle_plate, bus.main_driver_id, bus.support_driver_id, bus.vehicle_id, bus.vehicle_status from bus 
      join vehicle v on bus.vehicle_id = v.id 
      join user cu on bus.main_driver_id = cu.id 
      join user bu on bus.support_driver_id = bu.id
      where (cu.user_name like '%${querySearch}%') or (bu.user_name like '%${querySearch}%') 
      or (vehicle_plate like '%${querySearch}%') or (v.vehicle_name like '%${querySearch}%') limit ${limit} offset ${offset}`;
      const queryCount = `select count(*) from bus 
      join vehicle v on bus.vehicle_id = v.id 
      join user cu on bus.main_driver_id = cu.id 
      join user bu on bus.support_driver_id = bu.id
      where (cu.user_name like '%${querySearch}%') or (bu.user_name like '%${querySearch}%') 
      or (vehicle_plate like '%${querySearch}%') or (v.vehicle_name like '%${querySearch}%');`;
      let [getListBus, numberBus] = await Promise.all([
        db.sequelize.query(querySQL, { type: QueryTypes.SELECT }),
        db.sequelize.query(queryCount, { type: QueryTypes.SELECT }),
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
            delete getDriverMain.password;
            delete getDriverMain.password;
            delete getDriverMain.refresh_access_token;
            delete getDriverMain.refresh_access_token;
            getListBus[i].driverMain = getDriverMain;
          }
          if (getDriverSupport) {
            delete getDriverSupport.password;
            delete getDriverSupport.password;
            delete getDriverSupport.refresh_access_token;
            delete getDriverSupport.refresh_access_token;
            getListBus[i].driverSupport = getDriverSupport;
          }
          if (getVehicle) {
            getListBus[i].vehicle = getVehicle;
          }
        }
        return responseHandler.responseWithData(res, 200, {
          list_bus: getListBus,
          number_bus: numberBus[0]['count(*)'],
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
