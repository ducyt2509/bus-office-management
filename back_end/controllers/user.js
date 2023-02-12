const db = require('../models');
const User = db.users;
const Op = db.Sequelize.Op;

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
      console.log(123);
      let register = await User.create(registerForm);
      console.log(register);
      if (register) {
        result = {
          success: true,
          message: 'Register account successfully',
        };
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
