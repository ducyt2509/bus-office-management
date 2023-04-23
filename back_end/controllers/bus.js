const db = require('../models');
const Bus = db.buses;
const User = db.users;
const Vehicle_Type = db.vehicle_types;
const Op = db.Sequelize.Op;
const QueryTypes = db.Sequelize.QueryTypes;
const responseHandler = require('../handlers/response.handler');
const validateHandler = require('../handlers/validate.handler');
const messageHandler = require('../handlers/message.handler');
const regexHandler = require('../handlers/regex.handler');
const { get } = require('jquery');

const checkExistBus = async (vehicle_plate) => {
  const getBus = await Bus.findOne({
    where: {
      vehicle_plate: vehicle_plate,
    },
  });
  if (getBus) return true;
  return false;
};

const checkExistVehicleType = async (vehicle_type_id) => {
  const getType = await Vehicle_Type.findOne({
    where: {
      id: vehicle_type_id,
    },
  });

  if (getType) return getType.vehicle_type_name;
  return false;
};

module.exports = {
  async addNewBus(req, res) {
    const params = req.body;
    const { vehicle_plate, main_driver_id, support_driver_id, vehicle_type_id, vehicle_status } =
      req.body;
    try {
      const createBus = await Bus.create(params);
      if (createBus) {
        return responseHandler.ok(res, 'Add bus successful!');
      } else {
        return responseHandler.responseWithData(res, 403, { message: "Không thể tại mới chuyến xe" });
      }
    } catch (error) {
      return responseHandler.badRequest(res, "Có lỗi xảy ra khi thao tác. Vui lòng thử lại");
    }
  },

  async deleteBus(req, res) {
    try {
      const params = req.body;
      const bus_id = params.id;
      if (!validateHandler.validatePositiveIntegerNumber(parseInt(bus_id)))
        return responseHandler.badRequest(res, messageHandler.messageValidateFailed);
      const deleteBus = await Bus.destroy({
        where: {
          id: bus_id,
        },
      });
      if (deleteBus) {
        return responseHandler.ok(res, 'Xoá chuyến xe thành công!');
      } else {
        return responseHandler.badRequest(res, 'Chuyến xe không tồn tại');
      }
    } catch (error) {
      return responseHandler.badRequest(res, "Có lỗi xảy ra khi thao tác. Vui lòng thử lại");
    }
  },

  async getListBus(req, res) {
    try {
      var { limit, offset, query_search } = req.body;
      limit = limit ? limit : 7;
      offset = offset ? offset : 0;
      const querySearch = !query_search ? '' : query_search.toString().trim();

      if (
        !validateHandler.validatePositiveIntegerNumber(parseInt(limit)) ||
        !validateHandler.validatePositiveIntegerNumber(parseInt(offset))
      )
        return responseHandler.badRequest(res, messageHandler.messageValidateFailed);

      const querySQL = `select bus.id, bus.vehicle_plate, bus.main_driver_id, bus.support_driver_id, bus.vehicle_type_id, bus.vehicle_status from bus 
      join vehicle_type v on bus.vehicle_type_id = v.id 
      join user cu on bus.main_driver_id = cu.id 
      left join user bu on bus.support_driver_id = bu.id
      where (cu.user_name like '%${querySearch}%') or (bu.user_name like '%${querySearch}%') 
      or (vehicle_plate like '%${querySearch}%') or (v.vehicle_type_name like '%${querySearch}%') order  by id desc limit ${limit} offset ${offset}`;

      const queryCount = `select count(*) from bus 
      join vehicle_type v on bus.vehicle_type_id = v.id 
      join user cu on bus.main_driver_id = cu.id 
      left join user bu on bus.support_driver_id = bu.id
      where (cu.user_name like '%${querySearch}%') or (bu.user_name like '%${querySearch}%') 
      or (vehicle_plate like '%${querySearch}%') or (v.vehicle_type_name like '%${querySearch}%');`;
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
            Vehicle_Type.findOne({
              where: {
                id: getListBus[i].vehicle_type_id,
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
        return responseHandler.badRequest(res, 'Không thể lấy danh sách chuyến xe');
      }
    } catch (error) {
      return responseHandler.badRequest(res, "Có lỗi xảy ra khi thao tác. Vui lòng thử lại");
    }
  },

  async getInformationBus(req, res) {
    try {
      const params = req.body;
      const bus_id = params.id;
      if (!validateHandler.validatePositiveIntegerNumber(parseInt(bus_id)))
        return responseHandler.badRequest(res, messageHandler.messageValidateFailed);

      const getBusById = await Bus.findOne({
        where: {
          id: bus_id,
        },
      });
      if (getBusById) {
        return responseHandler.responseWithData(res, 200, getBusById);
      } else {
        return responseHandler.badRequest(res, 'Chuyến xe không tồn tại');
      }
    } catch (error) {
      return responseHandler.badRequest(res, "Có lỗi xảy ra khi thao tác. Vui lòng thử lại");
    }
  },

  async updateBusInformation(req, res) {
    try {
      const params = req.body;
      const bus_id = params.id;
      if (!validateHandler.validatePositiveIntegerNumber(parseInt(bus_id)))
        return responseHandler.badRequest(res, messageHandler.messageValidateFailed);

      const updateBus = await Bus.update(params, {
        where: {
          id: params.id,
        },
      });
      if (updateBus) {
        return responseHandler.ok(res, { message: 'Cập nhật chuyến xe thành công!' });
      } else {
        return responseHandler.badRequest(res, 'Chuyến xe không tồn tại');
      }
    } catch (error) {
      return responseHandler.badRequest(res, "Có lỗi xảy ra khi thao tác. Vui lòng thử lại");
    }
  },
};
