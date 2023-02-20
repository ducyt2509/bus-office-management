const db = require('../models');
const CITY = db.cities;
const Op = db.Sequelize.Op;

module.exports = {
  async getListCity(req, res) {
    let result = {
      success: false,
      message: "Can't get list city",
    };
    let listCity = await CITY.findAll();
    if (listCity) {
      result = {
        success: true,
        list_city: listCity,
      };
    }
    res.send(result);
  },
};
