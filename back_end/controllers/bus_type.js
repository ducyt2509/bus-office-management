const db = require('../models');
const Bus_type = db.bus_types;
const Op = db.Sequelize.Op;
const responseHandler = require('../handlers/response.handler');

module.exports = {
  async getListBusType(req, res) {
    const params = req.body;
    const bus_type_name = params.bus_type_name;
    const offset = params.offset;
    const limit = params.limit;
    try {
      const whereCondition = {};
      bus_type_name ? (whereCondition['bus_type_name'] = { [Op.like]: `%${bus_type_name}%` }) : '';
      const listBusType = await Bus_type.findAll({
        where: whereCondition,
        offset: offset,
        limit: limit,
      });
      return responseHandler.responseWithData(res, 200, listBusType);
    } catch (error) {
      return responseHandler.error(res);
    }
  },
  async addNewBusType(req, res) {
    try {
      if (!req.body.name) throw { message: 'Data is not null' };
      let newBusType = await Bus_type.create({
        bus_type_name: req.body.name,
      });
      if (newBusType) {
        return responseHandler.ok(res, 'Add new bus type successfully!');
      } else {
        return responseHandler.responseWithData(res, 403, { message: "Can't add new bus type" });
      }
    } catch (error) {
      return responseHandler.badRequest(res, error.message);
    }
  },

  async deleteBusType(req, res) {
    try {
      let busType = await Bus_type.findAll({
        where: {
          id: req.query?.id,
        },
      });
      if (!busType) return responseHandler.notfound(res);
      await Bus_type.destroy({
        where: {
          id: req.query?.id,
        },
      });
      return responseHandler.ok(res, 'Delete bus type successfully');
    } catch (error) {
      return responseHandler.badRequest(res, error.message);
    }
  },

  async updateBusType(req, res) {
    const params = req.body;
    try {
      const updateBusTypes = await Bus_type.update(params);
      if (updateBusTypes) {
        return responseHandler.ok(res, 'Update bus type successfully');
      } else {
        return responseHandler.responseWithData(res, 403, { message: "Can't update bus type" });
      }
    } catch (error) {
      return responseHandler.badRequest(res, error.message);
    }
  },
};
