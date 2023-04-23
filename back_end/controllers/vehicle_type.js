const db = require('../models');
const VehicleType = db.vehicle_types;
const Transport = db.transports;
const Op = db.Sequelize.Op;
const responseHandler = require('../handlers/response.handler');
const validateHandler = require('../handlers/validate.handler');
const messageHandler = require('../handlers/message.handler');

const checkExistVehicle = async (bus_schedule_id, bus_id, departure_date) => {
  const getTransport = await Transport.findOne({
    where: {
      [Op.and]: [
        {
          bus_schedule_id,
        },
        {
          bus_id,
        },
        {
          departure_date,
        },
      ],
    },
  });
  if (getTransport) return true;
  return false;
};

module.exports = {
  async getListVehicleType(req, res) {
    const params = req.body;
    const limit = !params?.limit ? 7 : params.limit;
    const offset = !params?.offset ? 0 : params.offset;
    const querySearch = !params?.query_search ? '' : params.query_search;
    if (
      !validateHandler.validatePositiveIntegerNumber(parseInt(limit)) ||
      !validateHandler.validatePositiveIntegerNumber(parseInt(offset))
    )
      return responseHandler.badRequest(res, messageHandler.messageValidateFailed);
    try {
      const whereCondition = {};
      querySearch ? (whereCondition['vehicle_name'] = { [Op.like]: `%${querySearch}%` }) : '';
      const listVehicle = await VehicleType.findAll({
        where: whereCondition,
        offset: offset,
        limit: limit,
      });
      return responseHandler.responseWithData(res, 200, listVehicle);
    } catch (error) {
      responseHandler.badRequest(res, 'Có lỗi xảy ra khi thao tác. Vui lòng thử lại');
    }
  },
  async addNewVehicleType(req, res) {
    try {
      if (!req.body.name) throw { message: 'Data is not null' };
      let newVehicle = await VehicleType.create({
        vehicle_name: req.body.name,
      });
      if (newVehicle) {
        return responseHandler.ok(res, 'Thêm loại xe mới thành công!');
      } else {
        return responseHandler.responseWithData(res, 403, {
          message: 'Không thể thêm loại xe mới',
        });
      }
    } catch (error) {
      responseHandler.badRequest(res, 'Có lỗi xảy ra khi thao tác. Vui lòng thử lại');
    }
  },

  async deleteVehicleType(req, res) {
    try {
      let VehicleType = await VehicleType.findAll({
        where: {
          id: req.query?.id,
        },
      });
      if (!VehicleType) return responseHandler.notfound(res);
      await VehicleType.destroy({
        where: {
          id: req.query?.id,
        },
      });
      return responseHandler.ok(res, 'Xoá loại xe thành công');
    } catch (error) {
      responseHandler.badRequest(res, 'Có lỗi xảy ra khi thao tác. Vui lòng thử lại');
    }
  },

  async updateVehicleType(req, res) {
    const params = req.body;
    try {
      const updateVehicles = await VehicleType.update(params, { where: { id: params.id } });
      if (updateVehicles) {
        return responseHandler.ok(res, 'Cập nhật loại xe thành công');
      } else {
        return responseHandler.responseWithData(res, 403, {
          message: 'Không thể cập nhật loại xe',
        });
      }
    } catch (error) {
      responseHandler.badRequest(res, 'Có lỗi xảy ra khi thao tác. Vui lòng thử lại');
    }
  },
};
