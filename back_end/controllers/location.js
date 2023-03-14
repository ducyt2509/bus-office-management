const db = require('../models');
const Location = db.locations;
const Op = db.Sequelize.Op;
const responseHandler = require('../handlers/response.handler');
const City = db.cities;

module.exports = {
  async getListLocation(req, res) {
    const params = req.body;
    const limit = params.limit;
    const offset = params.offset;
    const location_name = params.location_name;
    try {
      let whereCondition = {};
      if (location_name) {
        location_name['location_name'] = { [Op.like]: `%${location_name}%` };
      }
      const [listLocation, numberLocation] = await Promise.all([
        Location.findAll({
          where: whereCondition,
          limit: limit,
          offset: offset,
        }),
        Location.count({
          where: whereCondition,
        }),
      ]);
      if (listLocation) {
        for (let index = 0; index < listLocation.length; index++) {
          const getCity = await City.findOne({
            where: {
              id: listLocation[index].city_id,
            },
          })
          console.log('[CITY]', getCity);
          listLocation[index].dataValues.city_name = getCity.dataValues.city_name;

        }
      }
      return responseHandler.responseWithData(res, 200, { listLocation, numberLocation });
    } catch (error) {
      return responseHandler.badRequest(res, error.message);
    }
  },

  async addNewLocation(req, res) {
    const params = req.body;
    const location_name = params.location_name;
    try {
      if (!location_name) {
        return responseHandler.responseWithData(res, 403, { message: "Name can't empty" });
      } else {
        const newLocation = Location.create(params);
        if (newLocation) {
          return responseHandler.ok(res, 'Add new location successfully!');
        } else {
          return responseHandler.responseWithData(res, 403, {
            message: "Can't create new location",
          });
        }
      }
    } catch (error) {
      return responseHandler.badRequest(res, error.message);
    }
  },

  async deleteLocation(req, res) {
    const params = req.body;
    const location_id = params.id;
    try {
      let location = await Location.findAll({
        where: {
          id: location_id,
        },
      });
      if (!location.length) {
        return responseHandler.notfound(res);
      }
      const destroyLocation = await Location.destroy({
        where: {
          id: location_id,
        },
      });
      if (destroyLocation) {
        return responseHandler.ok(res, 'Delete location successfully');
      } else {
        return responseHandler.responseWithData(res, 404, { message: "Can't delete location" });
      }
    } catch (error) {
      return responseHandler.error(res);
    }
  },
  async updateLocation(req, res) {
    const params = req.body;
    try {
      const updateLocation = await Location.update(params, {
        where: {
          id: params.id,
        },
      });
      if (updateLocation) {
        return responseHandler.ok(res, 'Update location successfully');
      } else {
        return responseHandler.responseWithData(res, 403, { message: "Can't update location" });
      }
    } catch (error) {
      return responseHandler.badRequest(res, message.error);
    }
  },
};
