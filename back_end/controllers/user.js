const db = require('../models');
const User = db.users;
const Op = db.Sequelize.Op;
const OTPCode = require('../utils/OTPCode');
const responseHandler = require('../handlers/response.handler');

module.exports = {
  async createNewUser(req, res) {
    const params = req.body;
    const role_id = params.role_id;
    try {
      if (role_id == 1) {
        const createUser = await User.create(params);
        if (createUser) {
          handler.ok(res, 'Create user successful!');
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

  async loginAccount(req, res) {
    const params = req.body;
    const user = params.user;
    const password = params.password;
    try {
      if (user && password) {
        const getUser = await User.findOne({
          where: {
            [Op.or]: [{ email: user }, { phone: user }],
            password: password,
          },
        });
        if (getUser) {
          responseHandler.responseWithData(res, 200, { ...getUser, message: 'Login successful!' });
        } else {
          responseHandler.responseWithData(res, 200, { message: 'User or password was wrong' });
        }
      } else {
        responseHandler.responseWithData(res, 200, 'User and password can not empty');
      }
    } catch (error) {
      responseHandler.badRequest(res, { message: error.message });
    }
  },

  async sendCodeOTP(req, res) {
    try {
      const params = req.body;
      const user = params.user;
      if (user) {
        let getUser = await User.findOne({
          where: {
            [Op.or]: [{ email: user }, { phone: user }],
          },
          attributes: ['phone'],
        });
        let hashData = await OTPCode.sendCodeOTP(getUser.phone);
        let data = { ...hashData, user };
        responseHandler.responseWithData(res, 200, data);
      } else {
        throw { message: 'Data is not null' };
      }
    } catch (error) {
      responseHandler.badRequest(res, { message: error.message });
    }
  },

  async verifyCodeOTP(req, res) {
    try {
      const params = req.body;
      const user = params.user;
      const otpCode = params.otpCode;
      const hash = params.hash;
      const phone = params.phone;

      let verifyOTPCode = await OTPCode.verifyCodeOTP(phone, otpCode, hash);
      if (verifyOTPCode.success) {
        responseHandler.responseWithData(res, 200, user);
      } else {
        responseHandler.responseWithData(res, 200, verifyOTPCode);
      }
    } catch (error) {
      responseHandler.badRequest(res, { message: error.message });
    }
  },

  async changePassword(req, res) {
    const params = req.body;
    const password = params.password;
    const user = params.user;
    const verifyOTPCode = params.verifyOTPCode;
    const confirmPassword = params.confirm_password;
    try {
      if (verifyOTPCode.success && verifyOTPCode.message == 'Correct OTP Code') {
        if (confirmPassword && password) {
          if (password === confirmPassword) {
            let getUser = await User.findOne({
              where: {
                [Op.or]: [{ email: user }, { phone: user }],
              },
            });
            if (getUser) {
              let updateUser = await User.update(
                { password: password },
                {
                  where: {
                    [Op.or]: [{ email: user }, { phone: user }],
                  },
                }
              );
              if (updateUser) {
                responseHandler.ok(res, 'Update user successful!');
              } else {
                responseHandler.error(res);
              }
            } else {
              responseHandler.responseWithData(res, 200, 'User does not exist!');
            }
          } else {
            responseHandler.badRequest(res, 'password not equal to password');
          }
        } else {
          responseHandler.badRequest(res, 'password can not null');
        }
      } else {
        responseHandler.unauthorized(res);
      }
    } catch (error) {
      responseHandler.badRequest(res, { message: error.message });
    }
  },

  async getListUser(req, res) {
    const params = req.body;
    const limit = params.limit;
    const offset = params.offset;
    const querySearch = params.query_search;
    const role_id = params.role_id;

    try {
      if (role_id == 1) {
        const whereCondition = querySearch
          ? {
              [Op.or]: [
                {
                  email: {
                    [Op.like]: `%${querySearch}%`,
                  },
                },
                {
                  phone: {
                    [Op.like]: `%${querySearch}%`,
                  },
                },
                {
                  user_name: {
                    [Op.like]: `%${querySearch}%`,
                  },
                },
              ],
            }
          : {};
        let [getUser, numberUSer] = await Promise.all([
          User.findAll({
            where: whereCondition,
            limit: limit,
            offset: offset,
          }),
          User.count({
            where: whereCondition,
          }),
        ]);
        if (getUser) {
          responseHandler.responseWithData(res, 200, {
            list_user: getUser,
            number_user: numberUSer,
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
  async getUserInformation(req, res) {
    const params = req.body;
    const user_id = params.user_id;
    try {
      const getUserById = await User.findOne({
        where: {
          id: user_id,
        },
      });
      if (getUserById) {
        responseHandler.responseWithData(res, 200, getUserById);
      } else {
        responseHandler.error(res);
      }
    } catch (error) {
      responseHandler.badRequest(res, { message: error.message });
    }
  },
  async updateInformationUser(req, res) {
    const params = req.body;
    const user_id = params.id;
    const user_role_id = params.user_role_id;
    try {
      if (user_role_id != 1) {
        delete params.role_id;
      }
      let updateUser = await User.update(params, {
        where: {
          id: user_id,
        },
      });
      if (updateUser) {
        responseHandler.ok(res, { message: 'Update user successful!' });
      } else {
        responseHandler.error(res);
      }
    } catch (error) {
      responseHandler.badRequest(res, { message: error.message });
    }
  },
  async deleteUser(req, res) {
    const params = req.body;
    const role_id = params.role_id;
    const user_id = params.user_id;
    try {
      if (role_id == 1) {
        const deleteUser = await User.destroy({
          where: {
            id: user_id,
          },
        });
        if (deleteUser) {
          responseHandler.ok(res, { message: 'Delete user successful!' });
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
