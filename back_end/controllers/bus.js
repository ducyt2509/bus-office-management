const db = require('../models');
const Bus = db.buses;
const User = db.users;
const Op = db.Sequelize.Op;
const responseHandler = require('../handlers/response.handler');

module.exports = {
  async createNewBus(req, res) {
    const params = req.body;
    const role_id = params.role_id;
    try {
      if (role_id == 1) {
        const createBus = await Bus.create(params);
        if (createBus) {
          responseHandler.ok(res, 'Create bus successful!');
        } else {
          responseHandler.error(res);
        }
      } else {
        responseHandler.unauthorized(res);
      }
    } catch (error) {
      responseHandler.badRequest(res, { message: error.message });
    }
  },

  async deleteBus(req, res) {
    const params = req.body;
    const role_id = params.role_id;
    const bus_id = params.bus_id;
    try {
      if (role_id == 1) {
        const deleteBus = await Bus.destroy({
          where: {
            id: bus_id,
          },
        });
        if (deleteBus) {
          responseHandler.ok(res, 'Delete bus successful!');
        } else {
          responseHandler.error(res);
        }
      } else {
        responseHandler.unauthorized(res);
      }
    } catch (error) {
      responseHandler.badRequest(res, { message: error.message });
    }
  },

  async getListBus(req, res) {
    const params = req.body;
    const limit = params.limit;
    const offset = params.offset;
    const querySearch = params.query_search;
    const role_id = params.role_id;
    const bus_plate = params.bus_plate;
    const bus_type_id = params.bus_type_id;

    try {
      if (role_id == 1) {
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
        let [getBus, numberBus] = await Promise.all([
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
        if (getBus) {
          responseHandler.responseWithData(res, 200, {
            list_user: getBus,
            number_user: numberBus,
          });
        } else {
          responseHandler.error(res);
        }
      } else {
        responseHandler.unauthorized(res);
      }
    } catch (error) {
      responseHandler.badRequest(res, { message: error.message });
    }
  },

  async getInformationBus(req, res) {
    const params = req.body;
    const bus_id = params.bus_id;
    try {
      const getBusById = await Bus.findOne({
        where: {
          id: bus_id,
        },
      });
      if (getBusById) {
        responseHandler.responseWithData(res, 200, getBusById);
      } else {
        responseHandler.error(res);
      }
    } catch (error) {
      responseHandler.badRequest(res, { message: error.message });
    }
  },

  async updateBusInformation(req, res) {
    const params = req.body;
    const role_id = params.role_id;
    try {
      if (role_id == 1 || role_id == 3) {
        const dataUpdate = { ...params };
        delete dataUpdate.role_id;
        const updateBus = await Bus.update(dataUpdate, {
          where: {
            id: params.id,
          },
        });
        if (updateBus) {
          responseHandler.ok(res, { message: 'Update bus successful!' });
        } else {
          responseHandler.error(res);
        }
      } else {
        responseHandler.unauthorized(res);
      }
    } catch (error) {
      responseHandler.badRequest(res, { message: error.message });
    }
  },
};
