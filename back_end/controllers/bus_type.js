const db = require('../models');
const BUS_TYPE = db.bus_types;
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
      const listBusType = await BUS_TYPE.findAll({
        where: whereCondition,
        offset: offset,
        limit: limit,
      });
      responseHandler.responseWithData(res, 200, listBusType);
    } catch (error) {
      responseHandler.error(res);
    }
  },
  async addNewBusType(req, res) {
    try {
      if (!req.body.name) throw { message: 'Data is not null' };
      let newBusType = await BUS_TYPE.create({
        bus_type_name: req.body.name,
      });
      responseHandler.ok(res, 'Add new bus type successfully!');
    } catch (error) {
      responseHandler.badRequest(res, error.message);
    }
  },

  async deleteBusType(req, res) {
    try {
      let busType = await BUS_TYPE.findAll({
        where: {
          id: req.query?.id,
        },
      });
      if (!busType) return responseHandler.notfound(res);
      await BUS_TYPE.destroy({
        where: {
          id: req.query?.id,
        },
      });
      responseHandler.ok(res, 'Delete bus type successfully');
    } catch (error) {
      responseHandler.error(res);
    }
  },
};
