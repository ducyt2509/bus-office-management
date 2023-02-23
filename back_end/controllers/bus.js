const db = require('../models');
const Bus = db.buses;
const Op = db.Sequelize.Op;
const handler = require('../handlers/response.handler');

module.exports = {
  async createNewBus(req, res) {
    const params = req.body;
    const role_id = params.role_id;
    try {
      if (role_id == 1) {
        const createBus = await Bus.create(params);
        if (createBus) {
          handler.ok(res, 'Create bus successful!');
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
