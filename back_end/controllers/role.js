const db = require('../models');
const ROLE = db.roles;
const Op = db.Sequelize.Op;

module.exports = {
  async getListRole(req, res) {
    let result = {
      success: false,
      message: "Can't get list role",
    };
    let listRole = await ROLE.findAll();
    if (listRole) {
      result = {
        success: true,
        list_role: listRole,
      };
    }
    res.send(result);
  },
};
