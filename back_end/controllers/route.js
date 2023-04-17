const db = require('../models');
const Route = db.routes;
const City = db.cities;
const BS = db.bus_schedules;
const QueryTypes = db.Sequelize.QueryTypes;
const Op = db.Sequelize.Op;

const responseHandler = require('../handlers/response.handler');
const validateHandler = require('../handlers/validate.handler');
const messageHandler = require('../handlers/message.handler')
const regexHandler = require('../handlers/regex.handler')


const checkExistRoute = async (cityFrom, cityTo) => {
  const getRoute = await Route.findOne({
    where: {
      [Op.and]: [{ city_from_id: cityFrom }, { city_to_id: cityTo }],
    }
  })
  if (getRoute) return true
  return false
}
module.exports = {
  async addNewRoute(req, res) {

    try {
      const { city_from_id,
        city_to_id } = req.body
      if (!validateHandler.validatePositiveIntegerNumber(city_from_id) || !validateHandler.validatePositiveIntegerNumber(city_to_id))
        return responseHandler.badRequest(res, messageHandler.messageValidateFailed)
      const getCity = await City.findAll({
        where: {
          [Op.or]: [{ id: city_from_id }, { id: city_to_id }],
        },
      });
      if (!getCity || getCity.length < 2) return responseHandler.badRequest(res, "City to or city from is not exist in database")

      const isExist = await checkExistRoute(city_from_id, city_to_id);
      if (isExist) return responseHandler.badRequest(res, "Route is already exist")

      const createBusSchedule = await Route.create({
        city_from_id,
        city_to_id
      });
      if (createBusSchedule) {
        return responseHandler.ok(res, 'Create route successful!');
      } else {
        return responseHandler.badRequest(res, "Can't add new route");
      }
    } catch (error) {
      return responseHandler.error
    }
  },
  async updateRoute(req, res) {
    try {
      const { id, city_from_id,
        city_to_id } = req.body
      if (!validateHandler.validatePositiveIntegerNumber(id) || !validateHandler.validatePositiveIntegerNumber(city_from_id) || !validateHandler.validatePositiveIntegerNumber(city_to_id))
        return responseHandler.badRequest(res, messageHandler.messageValidateFailed)

      const checkExistId = await Route.findOne({ where: { id } })
      if (!checkExistId) return responseHandler.badRequest(res, "Route not found")

      const getCity = await City.findAll({
        where: {
          [Op.or]: [{ id: city_from_id }, { id: city_to_id }],
        },
      });
      if (!getCity || getCity.length < 2) return responseHandler.badRequest(res, "City to or city from is not exist in database")

      const isExistRoute = await checkExistRoute(city_from_id, city_to_id);
      if (isExistRoute) return responseHandler.badRequest(res, "Route is already exist")

      const updateRoute = await Route.update({
        city_from_id,
        city_to_id
      }, {
        where: {
          id,
        },
      });
      if (updateRoute) {
        return responseHandler.ok(res, 'Update route successful!');
      } else {
        return responseHandler.badRequest(res, "Route not found");
      }
    } catch (error) {
      return responseHandler.error
    }
  },
  async deleteRoute(req, res) {
    const { id } = req.body;
    if (!validateHandler.validatePositiveIntegerNumber(id)) return responseHandler.badRequest(res, messageHandler.messageValidateFailed)
    try {
      const deleteRoute = await Route.destroy({
        where: {
          id,
        },
      });
      if (deleteRoute) {
        return responseHandler.ok(res, 'Delete route successful!');
      } else {
        return responseHandler.badRequest(res, "Route not found")
      }
    } catch (error) {
      return responseHandler.badRequest(res, error.message);
    }
  },
  async getRouteById(req, res) {

    try {
      const { id } = req.body;
      if (!validateHandler.validatePositiveIntegerNumber(id)) return responseHandler.badRequest(res, messageHandler.messageValidateFailed)

      var getRoute = await Route.findOne({
        where: {
          id: id,
        },
      });
      if (getRoute) {
        return responseHandler.responseWithData(res, 200, { route: getRoute });
      } else {
        return responseHandler.badRequest(res, "Route not found")
      }
    } catch (error) {
      return responseHandler.badRequest(res, error.message);
    }
  },

  async getListRoute(req, res) {

    try {
      var { limit, offset, query_search } = req.body
      limit = limit ? limit : 7
      offset = offset ? offset : 0
      const querySearch = !query_search ? "" : query_search.toString().trim()
      if (!validateHandler.validatePositiveIntegerNumber(limit) || !validateHandler.validatePositiveIntegerNumber(offset))
        return responseHandler.badRequest(res, messageHandler.messageValidateFailed)
      const querySQL = `select route.id, route.city_from_id, route.city_to_id from route join city c on c.id = route.city_from_id
      join city cc on cc.id = route.city_to_id 
      where (cc.city_name like '%${querySearch}%')
      or (c.city_name like '%${querySearch}%') limit ${limit} offset ${offset}`;
      const queryCount = `select count(*)  as totalRoute from route join city c on c.id = route.city_from_id
      join city cc on cc.id = route.city_to_id 
      where (cc.city_name like '%${querySearch}%')
      or (c.city_name like '%${querySearch}%') limit ${limit} offset ${offset}`;
      const [listRoute, numberRoute] = await Promise.all([
        db.sequelize.query(querySQL, { type: QueryTypes.SELECT }),
        db.sequelize.query(queryCount, { type: QueryTypes.SELECT }),
      ]);
      const today = validateHandler.formatDate(new Date());
      if (listRoute) {
        for (let index = 0; index < listRoute.length; index++) {
          const [getCityFrom, getCityTo, getTotalBS] = await Promise.all([
            City.findOne({
              where: {
                id: listRoute[index].city_from_id,
              },
            }),
            City.findOne({
              where: {
                id: listRoute[index].city_to_id,
              },
            }),
            // count số lt đang hoạt động 
            db.sequelize.query(`select count(*) as total from bus_schedule where route_id = ${listRoute[index].id}  and refresh_date >= '${today}'  and bus_schedule_status = 1`, { type: QueryTypes.SELECT }),
          ]);
          listRoute[index].city_from = getCityFrom;
          listRoute[index].city_to = getCityTo;
          listRoute[index].totalBS = getTotalBS[0].total;
        }
        return responseHandler.responseWithData(res, 200, {
          list_route: listRoute,
          number_route: numberRoute[0]["totalRoute"],
        });
      } else {
        return responseHandler.responseWithData(res, 403, {
          message: "Can't get list route",
        });
      }
    } catch (error) {
      return responseHandler.badRequest(res, error.message);
    }
  },
};
