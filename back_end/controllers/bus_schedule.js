const db = require('../models');
const Bus_schedule = db.bus_schedules;
const Op = db.Sequelize.Op;
const responseHandler = require('../handlers/response.handler');

module.exports = {
  async createNewBusSchedule(req, res) {
    const params = req.body;
    try {
      const createBusSchedule = await Bus_schedule.create(params);
      if (createBusSchedule) {
        return responseHandler.ok(res, { message: 'Create bus schedule successful!' });
      } else {
        return responseHandler.error(res);
      }
    } catch (error) {
      return responseHandler.badRequest(res, error.message);
    }
  },
  async updateBusSchedule(req, res) {
    const params = req.body;
    try {
      const updateBC = await Bus_schedule.update(params, {
        where: {
          id: params.id,
        },
      });
      if (updateBC) {
        return responseHandler.ok(res, 'Update bus schedule successful!');
      } else {
        return responseHandler.responseWithData(res, 403, { message: "Can't update bus schedule" });
      }
    } catch (error) {
      return responseHandler.badRequest(res, error.message);
    }
  },
  async deleteBusSchedule(req, res) {
    const params = req.body;
    try {
      const deleteBusSchedule = await Bus_schedule.destroy({
        where: {
          id: params.id,
        },
      });
      if (deleteBusSchedule) {
        return responseHandler.ok(res, 'Delete bus schedule successful!');
      } else {
        return responseHandler.responseWithData(res, 403, { message: "Can't delete bus schedule" });
      }
    } catch (error) {
      return responseHandler.badRequest(res, error.message);
    }
  },
  async getListBusSchedule(req, res) {
    const params = req.body;
    const route_id = params.route_id;
    const offset = params.offset;
    const limit = params.limit;
    try {
      let whereCondition = { id: params.id };
      if (route_id) {
        whereCondition['route_id'] = { [Op.like]: `%${office_name}%` };
      }
      const [listBusSchedule, numberBusSchedule] = await Promise.all([
        Bus_schedule.findAll({
          where: whereCondition,
          offset: offset,
          limit: limit,
        }),
        Bus_schedule.count({
          where: whereCondition,
        }),
      ]);
      if (listBusSchedule) {
        return responseHandler.responseWithData(res, 200, {
          list_bus_schedule: listOffice,
          number_: numberBusSchedule,
        });
      } else {
        return responseHandler.responseWithData(res, 403, {
          message: "Can't get list bus schedule",
        });
      }
    } catch (error) {
      return responseHandler.badRequest(res, error.message);
    }
  },
};
