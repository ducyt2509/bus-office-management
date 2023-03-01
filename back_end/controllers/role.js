const db = require('../models');
const Role = db.roles;
const Op = db.Sequelize.Op;
const responseHandler = require('../handlers/response.handler');

module.exports = {
  async getListRole(req, res) {
    try {
      const listRole = await Role.findAll();
      if (listRole) {
        return responseHandler.responseWithData(res, 200, listRole);
      } else {
        return responseHandler.responseWithData(res, 403, { message: "Can't get list role" });
      }
    } catch (error) {
      return responseHandler.badRequest(res, error.message);
    }
  },
};
