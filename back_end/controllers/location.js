const db = require('../models');
const Location = db.locations;
const Op = db.Sequelize.Op;
const responseHandler = require('../handlers/response.handler');
const City = db.cities;
const QueryTypes = db.Sequelize.QueryTypes;

module.exports = {
  async getListLocation(req, res) {
    const params = req.body;
    const limit = params.limit;
    const offset = params.offset;
    const querySearch = params.query_search;
    try {
      const querySQL = `select * from location join city c on c.id = location.city_id  
      where (location_name like '%${querySearch}%') 
      or (address like '%${querySearch}%') 
      or (c.city_name like '%${querySearch}%') limit ${limit} offset ${offset}`;
      const queryCount = `select count(*) from location join city c on c.id = location.city_id  
      where (location_name like '%${querySearch}%') 
      or (address like '%${querySearch}%') 
      or (c.city_name like '%${querySearch}%')`;
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
