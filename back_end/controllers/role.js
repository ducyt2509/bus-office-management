const db = require('../models');
const Role = db.roles;
const Op = db.Sequelize.Op;
const responseHandler = require('../handlers/response.handler');

module.exports = {
  async getListRole(req, res) {
    try {
      const listRole = await Role.findAll();
      if (listRole) {
        return responseHandler.responseWithData(res, 200, { list_role: listRole });
      } else {
        return responseHandler.responseWithData(res, 403, {
          message: 'Không thể lấy danh sách chức vụ',
        });
      }
    } catch (error) {
      responseHandler.badRequest(res, 'Có lỗi xảy ra khi thao tác. Vui lòng thử lại');
    }
  },
};
