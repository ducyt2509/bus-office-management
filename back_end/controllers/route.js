const db = require('../models');
const Route = db.routes;
const responseHandler = require('../handlers/response.handler');
const City = db.cities;
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
    console.log("[PARAMS]:", params)
    try {
      const upRoute = await Route.update(params, {
        where: {
          id: params.id,
        },
      });
      if (upRoute) {
        console.log(upRoute, "[ROUTE]")
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
  async getListRoute(req, res) {
    const params = req.body;
    const offset = params.offset;
    const limit = params.limit;
    try {
      const [listRoute, numberRoute] = await Promise.all([
        Route.findAll({
          offset: offset,
          limit: limit,
        }),
        Route.count(),
      ]);
      if (listRoute) {
        for (let index = 0; index < listRoute.length; index++) {
          const [getCityFrom, getCityTo] = await Promise.all([
            City.findOne(
              {
                where: {
                  id: listRoute[index].city_from_id
                }
              }
            ),
            City.findOne(
              {
                where: {
                  id: listRoute[index].city_to_id
                }
              }
            )
          ])

          listRoute[index].dataValues.city_from = getCityFrom.dataValues.city_name
          listRoute[index].dataValues.city_to = getCityTo.dataValues.city_name

        }
        return responseHandler.responseWithData(res, 200, {
          list_route: listRoute,
          number_route: numberRoute,
        })
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
