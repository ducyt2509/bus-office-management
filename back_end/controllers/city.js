const db = require('../models');
const City = db.cities;
const responseHandler = require('../handlers/response.handler');

module.exports = {
  async getListCity(req, res) {
    const params = req.body;
    const limit = params.limit;
    const offset = params.offset;
    const city_name = params.city_name;
    try {
      let whereCondition = {};
      if (city_name) {
        whereCondition['city_name'] = { [Op.like]: `%${city_name}%` };
      }
      const [listCity, numberCity] = await Promise.all([
        City.findAll({
          where: whereCondition,
          limit: limit,
          offset: offset,
        }),
        City.count({
          where: whereCondition,
        }),
      ]);
      if (listCity) {
        return responseHandler.responseWithData(res, 200, { listCity, numberCity });
      } else {
        return responseHandler.responseWithData(res, 403, { message: "Can't get list city" });
      }
    } catch (error) {
      return responseHandler.badRequest(res, error.message);
    }
  },
  async updateCity(req, res) {
    const params = req.body;
    try {
      const updateCity = await Bus_type.update(params, {
        where: {
          id: params.id,
        },
      });
      if (updateCity) {
        return responseHandler.ok(res, 'Update city successfully');
      } else {
        return responseHandler.responseWithData(res, 403, { message: "Can't update city" });
      }
    } catch (error) {
      return responseHandler.badRequest(res, message.error);
    }
  },
  async addNewCity(req, res) {
    const params = req.body;
    try {
      const createCity = await Bus_type.create(params);
      if (createCity) {
        return responseHandler.ok(res, 'Add city successfully');
      } else {
        return responseHandler.responseWithData(res, 403, { message: "Can't add city" });
      }
    } catch (error) {
      return responseHandler.badRequest(res, message.error);
    }
  },
  async deleteCity(req, res) {
    const params = req.body;
    try {
      const destroyCity = await Bus_type.destroy({
        where: {
          id: params.id,
        },
      });
      if (destroyCity) {
        return responseHandler.ok(res, 'Delete city successfully');
      } else {
        return responseHandler.responseWithData(res, 403, { message: "Can't delete city" });
      }
    } catch (error) {
      return responseHandler.badRequest(res, message.error);
    }
  },
};
