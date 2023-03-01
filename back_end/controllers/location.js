const db = require('../models');
const Location = db.locations;
const Op = db.Sequelize.Op;
const responseHandler = require('../handlers/response.handler');

module.exports = {
  async getListLocation(req, res) {
    const params = req.body;
    const limit = params.limit;
    const offset = params.offset;
    const location_name = params.location_name;
    try {
      let whereCondition = {};
      if (city_name) {
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
        return responseHandler.responseWithData(res, 200, { listLocation, numberLocation });
      } else {
        return responseHandler.responseWithData(res, 403, { message: "Can't get list location" });
      }
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

      if (!location) {
        return responseHandler.notfound(res);
      }
      const destroyLocation = await LOCATION.destroy({
        where: {
          id: location_id,
        },
      });
      if (destroyLocation) {
        return responseHandler.ok(res, 'Delete location successfully');
      } else {
        return responseHandler.responseWithData(res, 403, { message: "Can't delete location" });
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
