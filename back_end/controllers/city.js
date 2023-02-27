const db = require('../models');
const CITY = db.cities;
const responseHandler = require('../handlers/response.handler');

module.exports = {
  async getListCity(req, res) {
    try {
      let listCity = await CITY.findAll();
      if (listCity) {
        responseHandler.responseWithData(res, 200, listCity);
      } else {
        responseHandler.badRequest(res, "Can't get list city");
      }
    } catch (error) {
      responseHandler.badRequest(res, { message: error.message });
    }
  },
};
