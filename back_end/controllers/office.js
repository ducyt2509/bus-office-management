const db = require('../models');
const Office = db.offices;
const Op = db.Sequelize.Op;
const responseHandler = require('../handlers/response.handler');

module.exports = {
  async createNewOffice(req, res) {
    const params = req.body;
    const role_id = params.role_id;
    try {
      if (role_id == 1) {
        const createOffice = await Office.create(params);
        if (createOffice) {
          responseHandler.ok(res, { message: 'Create office successful!' });
        } else {
          responseHandler.error(res);
        }
      } else {
        responseHandler.unauthorized(res);
      }
    } catch (error) {
      responseHandler.badRequest(res, error.message);
    }
  },
  async updateOfficeInformation(req, res) {
    const params = req.body;
    const role_id = params.role_id;
    try {
      if (role_id == 1) {
        const officeData = { ...params };
        delete officeData.role_id;
        const updateOffice = await Office.update(officeData, {
          where: {
            id: params.id,
          },
        });
        if (updateOffice) {
          responseHandler.ok(res, { message: 'Update office successful!' });
        } else {
          responseHandler.error(res);
        }
      } else {
        responseHandler.unauthorized(res);
      }
    } catch (error) {
      responseHandler.badRequest(res, { message: error.message });
    }
  },
  async deleteOfficeInformation(req, res) {
    const params = req.body;
    const role_id = params.role_id;
    try {
      if (role_id == 1) {
        const deleteOffice = await Office.destroy({
          where: {
            id: params.id,
          },
        });
        if (deleteOffice) {
          responseHandler.ok(res, { message: 'Delete office successful!' });
        } else {
          responseHandler.error(res);
        }
      } else {
        responseHandler.unauthorized(res);
      }
    } catch (error) {
      responseHandler.badRequest(res, { message: error.message });
    }
  },
  async getListOffice(req, res) {
    const params = req.body;
    const role_id = params.role_id;
    const office_name = params.office_name;
    const offset = params.offset;
    const limit = params.limit;
    try {
      if (role_id == 1) {
        let whereCondition = { id: params.id };
        if (office_name) {
          whereCondition['office_name'] = { [Op.like]: `%${office_name}%` };
        }
        const [listOffice, numberOffice] = await Promise.all([
          Office.findAll({
            where: whereCondition,
            offset: offset,
            limit: limit,
          }),
          Office.count({
            where: whereCondition,
          }),
        ]);
        if (listOffice) {
          responseHandler.responseWithData(res, 200, {
            list_office: listOffice,
            number_office: numberOffice,
          });
        } else {
          responseHandler.error(res);
        }
      } else {
        responseHandler.unauthorized(res);
      }
    } catch (error) {
      responseHandler.badRequest(res, { message: error.message });
    }
  },
  async getOfficeInformation(req, res) {
    const params = req.params;
    const role_id = params.role_id;
    const id = params.id;
    try {
      if (role_id == 1) {
        const officeInformation = await Office.findOne({
          where: {
            id: id,
          },
        });
        if (officeInformation) {
          responseHandler.responseWithData(res, 200, officeInformation);
        } else {
          responseHandler.error(res);
        }
      } else {
        responseHandler.unauthorized(res);
      }
    } catch (error) {
      responseHandler.badRequest(res, { message: error.message });
    }
  },
};
