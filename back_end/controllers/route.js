const db = require('../models');
const Route = db.routes;
const responseHandler = require('../handlers/response.handler');
const City = db.cities;
const QueryTypes = db.Sequelize.QueryTypes;
module.exports = {
  async addNewRoute(req, res) {
    const params = req.body;
    try {
      const createBusSchedule = await Route.create(params);
      if (createBusSchedule) {
        return responseHandler.ok(res, 'Create role successful!');
      } else {
        return responseHandler.responseWithData(res, 403, { message: "Can't add new route" });
      }
    } catch (error) {
      return responseHandler.badRequest(res, error.message);
    }
  },
  async updateRoute(req, res) {
    const params = req.body;
    try {
      const upRoute = await Route.update(params, {
        where: {
          id: params.id,
        },
      });
      if (upRoute) {
        return responseHandler.ok(res, 'Update route successful!');
      } else {
        return responseHandler.responseWithData(res, 403, { message: "Can't update route" });
      }
    } catch (error) {
      return responseHandler.badRequest(res, error.message);
    }
  },
  async deleteRoute(req, res) {
    const params = req.body;
    try {
      const deleteRoute = await Route.destroy({
        where: {
          id: params.id,
        },
      });
      if (deleteRoute) {
        return responseHandler.ok(res, 'Delete route successful!');
      } else {
        return responseHandler.responseWithData(res, 403, { message: "Can't delete route" });
      }
    } catch (error) {
      return responseHandler.badRequest(res, error.message);
    }
  },
  async getRouteById(req, res) {
    const params = req.body;
    const id = params.id;
    if (!id) return responseHandler.responseWithData(res, 200, { route: null });
    try {
      const getRoute = await Route.findOne({
        where: {
          id: id,
        },
      });
      if (getRoute) {
        return responseHandler.responseWithData(res, 200, { route: getRoute });
      }
    } catch (error) {
      return responseHandler.badRequest(res, error.message);
    }
  },

  async getListRoute(req, res) {
    const params = req.body;
    const offset = params.offset;
    const limit = params.limit;
    const querySearch = params.query_search;
    try {
      const querySQL = `select route.id, route.city_from_id, route.city_to_id from route join city c on c.id = route.city_from_id
      join city cc on cc.id = route.city_to_id 
      where (cc.city_name like '%${querySearch}%')
      or (c.city_name like '%${querySearch}%') limit ${limit} offset ${offset}`;
      const queryCount = `select count(*) from route join city c on c.id = route.city_from_id
      join city cc on cc.id = route.city_to_id 
      where (cc.city_name like '%${querySearch}%')
      or (c.city_name like '%${querySearch}%') limit ${limit} offset ${offset}`;
      const [listRoute, numberRoute] = await Promise.all([
        db.sequelize.query(querySQL, { type: QueryTypes.SELECT }),
        db.sequelize.query(queryCount, { type: QueryTypes.SELECT }),
      ]);
      if (listRoute) {
        for (let index = 0; index < listRoute.length; index++) {
          const [getCityFrom, getCityTo] = await Promise.all([
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
          ]);

          listRoute[index].city_from = getCityFrom;
          listRoute[index].city_to = getCityTo;
        }
        return responseHandler.responseWithData(res, 200, {
          list_route: listRoute,
          number_route: numberRoute[0]['count(*)'],
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
