const db = require('../models');
const Office = db.offices;
const Op = db.Sequelize.Op;

module.exports = {
    async createNewOffice(req, res) {
        const params = req.body;
        const role_id = params.role_id;
        try {
          if (role_id == 1) {
            const createOffice = await Office.create(params);
            if (createOffice) {
              handler.ok(res, 'Create office successful!');
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
