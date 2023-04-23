const db = require('../models');
const City = db.cities;
const Op = db.Sequelize.Op;
const responseHandler = require('../handlers/response.handler');
const validateHandler = require('../handlers/validate.handler');
const messageHandler = require('../handlers/message.handler');
const regexHandler = require('../handlers/regex.handler');

module.exports = {
  async getListCity(req, res) {
    try {
      var { limit, offset, city_name } = req.body;
      // limit = limit ? limit : 7
      // offset = offset ? offset : 0
      city_name = !city_name ? '' : city_name.toString().trim();
      // if (!validateHandler.validatePositiveIntegerNumber(limit) || !validateHandler.validatePositiveIntegerNumber(offset))
      //   return responseHandler.badRequest(res, messageHandler.messageValidateFailed)

      let whereCondition = {};
      if (city_name) {
        whereCondition['city_name'] = { [Op.like]: `%${city_name}%` };
      }
      const [listCity, numberCity] = await Promise.all([
        City.findAll({
          where: whereCondition,
          limit: limit,
          offset: offset,
          order: [['id', 'DESC']],
        }),
        City.count({
          where: whereCondition,
        }),
      ]);
      if (listCity) {
        return responseHandler.responseWithData(res, 200, { listCity, numberCity });
      } else {
        return responseHandler.responseWithData(res, 403, {
          message: 'Không thể lấy danh sách thành phố',
        });
      }
    } catch (error) {
      return responseHandler.badRequest(res, 'Có lỗi xảy ra khi thao tác. Vui lòng thử lại');
    }
  },
  async updateCity(req, res) {
    try {
      const params = req.body;
      const id = params.id;
      if (!validateHandler.validatePositiveIntegerNumber(parseInt(id)))
        return responseHandler.badRequest(res, messageHandler.messageValidateFailed);

      const updateCity = await Bus_type.update(params, {
        where: {
          id: params.id,
        },
      });
      if (updateCity) {
        return responseHandler.ok(res, 'Cập nhật thông tin thành phố thành công!');
      } else {
        return responseHandler.badRequest(res, 'Thành phố không tồn tại');
      }
    } catch (error) {
      return responseHandler.badRequest(res, 'Có lỗi xảy ra khi thao tác. Vui lòng thử lại');
    }
  },
  async addNewCity(req, res) {
    try {
      var { city_name } = req.body;
      if (!validateHandler.validateString(city_name, regexHandler.regexNormalString))
        return responseHandler.badRequest(res, messageHandler.messageValidateFailed);
      city_name = city_name.trim();
      const checkExists = await City.findOne({ where: { city_name } });
      if (checkExists) return responseHandler.badRequest(res, 'City is already exist');
      const createCity = await City.create({ city_name });
      if (createCity) {
        return responseHandler.ok(res, 'Thêm thành phố thành công!');
      } else {
        return responseHandler.badRequest(res, 'Không thể thêm thông tin thành phố');
      }
    } catch (error) {
      return responseHandler.badRequest(res, 'Có lỗi xảy ra khi thao tác. Vui lòng thử lại');
    }
  },
  async deleteCity(req, res) {
    const { id } = req.body;
    try {
      if (!validateHandler.validatePositiveIntegerNumber(parseInt(id)))
        return responseHandler.badRequest(res, messageHandler.messageValidateFailed);
      const checkExists = await City.findOne({ where: { id } });
      if (!checkExists) return responseHandler.badRequest(res, 'Thành phố không tồn tại');
      const destroyCity = await City.destroy({
        where: {
          id,
        },
      });
      if (destroyCity) {
        return responseHandler.ok(res, 'Xoá thông tin thành phố thành công!');
      } else {
        return responseHandler.responseWithData(res, 403, { message: "Không thể xoá thông tin thành phố" });
      }
    } catch (error) {
      return responseHandler.badRequest(res, 'Có lỗi xảy ra khi thao tác. Vui lòng thử lại');
    }
  },
};
