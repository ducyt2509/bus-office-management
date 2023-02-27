const db = require('../models');
const Bus_schedule = db.bus_schedules;
const Op = db.Sequelize.Op;
const handler = require('../handlers/response.handler');

module.exports = {
  async createNewBusSchedule(req, res) {
    const params = req.body;
    const role_id = params.role_id;
    try {
      if (role_id == 1) {
        const createBusSchedule = await Bus_schedule.create(params);
        if (createBusSchedule) {
          handler.ok(res, { message: 'Create bus schedule successful!' });
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
