const db = require('../models');
const Vehicle = db.vehicles;
const Op = db.Sequelize.Op;
const responseHandler = require('../handlers/response.handler');

module.exports = {
  async getListVehicle(req, res) {
    const params = req.body;
    const vehicle_name = params.vehicle_name;
    const offset = params.offset;
    const limit = params.limit;
    try {
      const whereCondition = {};
      vehicle_name ? (whereCondition['vehicle_name'] = { [Op.like]: `%${vehicle_name}%` }) : '';
      const listVehicle = await Vehicle.findAll({
        where: whereCondition,
        offset: offset,
        limit: limit,
      });
      return responseHandler.responseWithData(res, 200, listVehicle);
    } catch (error) {
      return responseHandler.error(res);
    }
  },
  async addNewVehicle(req, res) {
    try {
      if (!req.body.name) throw { message: 'Data is not null' };
      let newVehicle = await Vehicle.create({
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

  async deleteVehicle(req, res) {
    try {
      let Vehicle = await Vehicle.findAll({
        where: {
          id: req.query?.id,
        },
      });
      if (!Vehicle) return responseHandler.notfound(res);
      await Vehicle.destroy({
        where: {
          id: req.query?.id,
        },
      });
      return responseHandler.ok(res, 'Delete bus type successfully');
    } catch (error) {
      return responseHandler.badRequest(res, error.message);
    }
  },

  async updateVehicle(req, res) {
    const params = req.body;
    try {
      const updateVehicles = await Vehicle.update(params, { where: { id: params.id } });
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
