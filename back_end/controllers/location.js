const db = require('../models');
const Location = db.locations;
const Op = db.Sequelize.Op;
const responseHandler = require('../handlers/response.handler');
const City = db.cities;
const QueryTypes = db.Sequelize.QueryTypes;

const validateHandler = require('../handlers/validate.handler');
const messageHandler = require('../handlers/message.handler');
const regexHandler = require('../handlers/regex.handler');

module.exports = {
  async getListLocation(req, res) {
    try {
      var { limit, offset, query_search, route } = req.body;
      limit = limit ? limit : 7;
      offset = offset ? offset : 0;
      const querySearch = !query_search ? '' : query_search.toString().trim();

      if (
        !validateHandler.validatePositiveIntegerNumber(parseInt(limit)) ||
        !validateHandler.validatePositiveIntegerNumber(parseInt(offset))
      )
        return responseHandler.badRequest(res, messageHandler.messageValidateFailed);

      let querySQL = `select location.id, location.location_name, location.address, location.city_id from location join city c on c.id = location.city_id  
      where (location_name like '%${querySearch}%') 
      or (address like '%${querySearch}%') 
      or (c.city_name like '%${querySearch}%') order  by id desc limit ${limit} offset ${offset}`;
      let queryCount = `select count(*) from location join city c on c.id = location.city_id  
      where (location_name like '%${querySearch}%') 
      or (address like '%${querySearch}%') 
      or (c.city_name like '%${querySearch}%')`;
      if (route) {
        querySQL = `select location.id, location.location_name, location.address, location.city_id from location join city c on c.id = location.city_id  
      where (location_name like '%${querySearch}%'
      or address like '%${querySearch}%'
      or c.city_name like '%${querySearch}%') 
      and (location.city_id = ${route?.city_from_id} or location.city_id = ${route?.city_to_id})
      order  by id desc limit ${limit} offset ${offset}`;
        queryCount = `select count(*) from location l join city c on c.id = l.city_id  
      where (location_name like '%${querySearch}%'
      or address like '%${querySearch}%'
      or c.city_name like '%${querySearch}%')
      and (l.city_id = ${route?.city_from_id} or l.city_id = ${route?.city_to_id})`;
      }
      const [listLocation, numberLocation] = await Promise.all([
        db.sequelize.query(querySQL, { type: QueryTypes.SELECT }),
        db.sequelize.query(queryCount, { type: QueryTypes.SELECT }),
      ]);
      if (listLocation) {
        for (let index = 0; index < listLocation.length; index++) {
          const getCity = await City.findOne({
            where: {
              id: listLocation[index].city_id,
            },
          });
          listLocation[index].city_name = getCity.city_name;
        }
      }
      return responseHandler.responseWithData(res, 200, {
        listLocation,
        numberLocation: numberLocation[0]['count(*)'],
      });
    } catch (error) {
      return responseHandler.badRequest(res, 'Có lỗi xảy ra khi thao tác. Vui lòng thử lại');
    }
  },

  async addNewLocation(req, res) {
    try {
      const { location_name, address, city_id } = req.body;

      if (
        !validateHandler.validateString(location_name, regexHandler.regexNormalString) ||
        !validateHandler.validateString(address, regexHandler.regexNormalString) ||
        !validateHandler.validatePositiveIntegerNumber(parseInt(city_id))
      )
        return responseHandler.badRequest(res, messageHandler.messageValidateFailed);

      const getCity = await City.findOne({ where: { id: city_id } });

      if (!getCity) {
        return responseHandler.badRequest(res, 'Thành phố không tồn tại!');
      }
      const location = await Location.findOne({
        where: {
          [Op.or]: [{ location_name }, { address }],
        },
      });
      if (location) {
        return responseHandler.badRequest(res, 'Địa điểm đã tồn tại');
      }
      const newLocation = await Location.create({ location_name, address, city_id });
      if (newLocation) {
        return responseHandler.ok(res, 'Thêm  địa điểm mới thành công!');
      } else {
        return responseHandler.badRequest(res, 'Không thể thêm địa điểm mới');
      }
    } catch (error) {
      return responseHandler.badRequest(res, 'Có lỗi xảy ra khi thao tác. Vui lòng thử lại');
    }
  },

  async deleteLocation(req, res) {
    try {
      const params = req.body;
      const id = params.id;

      if (!validateHandler.validatePositiveIntegerNumber(parseInt(id)))
        return responseHandler.badRequest(res, messageHandler.messageValidateFailed);
      const getLocation = await Location.findOne({ where: { id } });
      if (!getLocation) {
        return responseHandler.badRequest(res, 'Địa điểm không tồn tại');
      }
      const destroyLocation = await Location.destroy({
        where: {
          id: id,
        },
      });
      if (destroyLocation) {
        return responseHandler.ok(res, 'Xoá địa điểm thành công');
      } else {
        return responseHandler.badRequest(res, 'Không thể xoá địa điểm');
      }
    } catch (error) {
      responseHandler.badRequest(res, 'Có lỗi xảy ra khi thao tác. Vui lòng thử lại');
    }
  },
  async updateLocation(req, res) {
    try {
      const { id, location_name, address, city_id } = req.body;
      if (
        !validateHandler.validatePositiveIntegerNumber(
          parseInt(id),
          regexHandler.regexNormalString
        ) ||
        !validateHandler.validatePositiveIntegerNumber(
          parseInt(city_id),
          regexHandler.regexNormalString
        ) ||
        !validateHandler.validateString(location_name, regexHandler.regexNormalString) ||
        !validateHandler.validateString(address, regexHandler.regexNormalString)
      )
        return responseHandler.badRequest(res, messageHandler.messageValidateFailed);

      const getCity = await City.findOne({ where: { id: city_id } });
      if (!getCity) {
        return responseHandler.badRequest(res, "Thành phố không tồn tại");
      }

      const getLocation = await Location.findOne({ where: { id } });
      if (!getLocation) {
        return responseHandler.badRequest(res, 'Địa điểm không tồn tại');
      }
      if (getLocation.dataValues.location_name != location_name) {
        const checkNameExist = await Location.findOne({ where: { location_name } });
        if (checkNameExist) return responseHandler.badRequest(res, 'Tên địa điểm đã tồn tại');
      }

      if (getLocation.dataValues.address != address) {
        const checkAddressExist = await Location.findOne({ where: { address } });
        if (checkAddressExist) return responseHandler.badRequest(res, 'Địa chỉ địa đã tồn tại');
      }
      const updateLocation = await Location.update(
        { location_name, address, city_id },
        {
          where: {
            id,
          },
        }
      );
      if (updateLocation) {
        return responseHandler.ok(res, 'Cập nhật địa điểm thành công!');
      } else {
        return responseHandler.badRequest(res, 'Không thể cập nhật địa điểm');
      }
    } catch (error) {
      responseHandler.badRequest(res, 'Có lỗi xảy ra khi thao tác. Vui lòng thử lại');
    }
  },
};
