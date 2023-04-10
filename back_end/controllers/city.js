const db = require('../models');
const City = db.cities;
const Op = db.Sequelize.Op;
const responseHandler = require('../handlers/response.handler');
const validateHandler = require('../handlers/validate.handler');
const messageHandler = require('../handlers/message.handler')
const regexHandler = require('../handlers/regex.handler')

module.exports = {
  async getListCity(req, res) {

    try {
      var { limit, offset, city_name } = req.body
      limit = limit ? limit : 7
      offset = offset ? offset : 0
      city_name = !city_name ? "" : city_name.toString().trim()
      if (!validateHandler.validatePositiveIntegerNumber(limit) || !validateHandler.validatePositiveIntegerNumber(offset))
        return responseHandler.badRequest(res, messageHandler.messageValidateFailed)

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
    try {
      const params = req.body;
      const id = params.id
      if (!validateHandler.validatePositiveIntegerNumber(id)) return responseHandler.badRequest(res, messageHandler.messageValidateFailed)

      const updateCity = await Bus_type.update(params, {
        where: {
          id: params.id,
        },
      });
      if (updateCity) {
        return responseHandler.ok(res, 'Update city successfully');
      } else {
        return responseHandler.badRequest(res, "City not found");
      }
    } catch (error) {
      return responseHandler.error
    }
  },
  async addNewCity(req, res) {
    try {
      var { city_name } = req.body
      if (!validateHandler.validateString(city_name, regexHandler.regexNormalString)) return responseHandler.badRequest(res, messageHandler.messageValidateFailed)
      city_name = city_name.trim()
      const checkExists = await City.findOne({ where: { city_name } })
      if (checkExists) return responseHandler.badRequest(res, "City is already exist")
      const createCity = await City.create({ city_name });
      console.log('createCity', createCity)
      if (createCity) {
        return responseHandler.ok(res, 'Add city successfully');
      } else {
        return responseHandler.badRequest(res, 'Cant add new city')
      }
    } catch (error) {
      return responseHandler.error
    }
  },
  async deleteCity(req, res) {
    const { id } = req.body;
    try {
      if (!validateHandler.validatePositiveIntegerNumber(id)) return responseHandler.badRequest(res, messageHandler.messageValidateFailed)
      const checkExists = await City.findOne({ where: { id } })
      if (!checkExists) return responseHandler.badRequest(res, "City not found")
      const destroyCity = await City.destroy({
        where: {
          id
        },
      });
      if (destroyCity) {
        return responseHandler.ok(res, 'Delete city successfully');
      } else {
        return responseHandler.responseWithData(res, 403, { message: "Can't delete city" });
      }
    } catch (error) {
      return responseHandler.error
    }
  },
};
