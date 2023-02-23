const db = require('../models');
const Route = db.routes;
const Op = db.Sequelize.Op;
const handler = require('../handlers/response.handler');

module.exports = {
  async createNewRoute(req, res) {
    const params = req.body;
    const role_id = params.role_id;
    try {
      if (role_id == 1) {
        const createBusSchedule = await Route.create(params);
        if (createBusSchedule) {
          handler.ok(res, 'Create role successful!');
        } else {
          handler.error(res);
        }
      } else {
        handler.unauthorized(res);
      }
    } catch (error) {
      handler.badRequest(res, error.message);
    }
  },
};
