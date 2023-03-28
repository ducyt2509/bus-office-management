const db = require('../models');
const VehicleType = db.vehicle_types;
const Op = db.Sequelize.Op;
const responseHandler = require('../handlers/response.handler');

module.exports = {
  async getListVehicleType(req, res) {
    const params = req.body;
    const vehicle_name = params.vehicle_name;
    const offset = params.offset;
    const limit = params.limit;
    try {
      const whereCondition = {};
      vehicle_name ? (whereCondition['vehicle_name'] = { [Op.like]: `%${vehicle_name}%` }) : '';
      const listVehicle = await VehicleType.findAll({
        where: whereCondition,
        offset: offset,
        limit: limit,
      });
      return responseHandler.responseWithData(res, 200, listVehicle);
    } catch (error) {
      return responseHandler.error(res);
    }
  },
  async addNewVehicleType(req, res) {
    try {
      if (!req.body.name) throw { message: 'Data is not null' };
      let newVehicle = await VehicleType.create({
        vehicle_name: req.body.name,
      });
      if (newVehicle) {
        return responseHandler.ok(res, 'Add new bus type successfully!');
      } else {
        return responseHandler.responseWithData(res, 403, { message: "Can't add new bus type" });
      }
    } catch (error) {
      return responseHandler.badRequest(res, error.message);
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
      return responseHandler.ok(res, 'Delete bus type successfully');
    } catch (error) {
      return responseHandler.badRequest(res, error.message);
    }
  },

  async updateVehicleType(req, res) {
    const params = req.body;
    try {
      const updateVehicles = await VehicleType.update(params, { where: { id: params.id } });
      if (updateVehicles) {
        return responseHandler.ok(res, 'Update bus type successfully');
      } else {
        return responseHandler.responseWithData(res, 403, { message: "Can't update bus type" });
      }
    } catch (error) {
      return responseHandler.badRequest(res, error.message);
    }
  },
};
