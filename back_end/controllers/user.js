const db = require('../models');
const User = db.users;
const Op = db.Sequelize.Op;
const OTPCode = require('../utils/OTPCode');
const responseHandler = require('../handlers/response.handler');

module.exports = {
  async sendCodeOTP(req, res) {
    try {
      const params = req.body;
      const user = params.user;
      const password = params.password;
      if (user && password) {
        let getUser = await User.findOne({
          where: {
            [Op.or]: [{ email: user }, { phone: user }],
            password,
          },
        });
        let hashData = await OTPCode.sendCodeOTP(getUser.phone);
        let data = { ...hashData, user, password };
        responseHandler.responseWithData(res, 200, data);
      } else {
        throw { message: 'Data is not null' };
      }
    } catch (error) {
      responseHandler.badRequest(res, error.message);
    }
  },

  async loginAccount(req, res) {
    try {
      const params = req.body;
      const user = params.user;
      const password = params.password;
      const otpCode = params.otpCode;
      const hash = params.hash;
      const phone = params.phone;

      let verifyOTPCode = await OTPCode.verifyCodeOTP(phone, otpCode, hash);
      if (verifyOTPCode.success) {
        let getUser = await User.findOne({
          where: {
            [Op.or]: [{ email: user }, { phone: user }],
            password,
          },
        });
        responseHandler.responseWithData(res, 200, getUser);
      } else {
        responseHandler.responseWithData(res, 200, verifyOTPCode);
      }
    } catch (error) {
      responseHandler.badRequest(res, error.message);
    }
  },
};
