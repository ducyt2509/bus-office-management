const db = require('../models');
const User = db.users;
const Op = db.Sequelize.Op;
const sendCode = require('../utils/sendCode');

module.exports = {
  async registerUser(req, res) {
    let params = req.body;
    let result = {
      success: false,
      message: "Can't register account",
    };
    if (params.email && params.password) {
      let registerForm = {
        email: params.email,
        password: params.password,
      };
      let register = await User.create(registerForm);
      if (register) {
        result = {
          success: true,
          message: 'Register account successfully',
        };
        sendCode();
      }
      res.send(result);
    }
  },
  async getListUser(req, res) {
    let params = req.body;
    let listUser = await User.findAll();
    if (listUser) {
      res.send(listUser);
    }
  },
};
