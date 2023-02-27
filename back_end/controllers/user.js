const db = require('../models');
const User = db.users;
const Op = db.Sequelize.Op;
const OTPCode = require('../utils/OTPCode');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const responseHandler = require('../handlers/response.handler');
// require("crypto").randomBytes(64).toString('hex')
const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      role_id: user.role_id,
    },
    process.env.JWT_REFRESH_SECRET_TOKEN,
    { expiresIn: '2h' }
  );
};
const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      role_id: user.role_id,
    },
    process.env.JWT_SECRET_TOKEN,
    { expiresIn: '1d' }
  );
};

module.exports = {
  async createNewUser(req, res) {
    const params = req.body;
    const user_role_id = params.user_role_id;
    try {
      if (user_role_id == 1) {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = bcrypt.hashSync(params.password, salt);
        const newUser = {
          ...params,
          password: hashPassword,
          role_id: params.user_role_id,
        };
        const createUser = await User.create(newUser);
        if (createUser) {
          responseHandler.ok(res, 'Create user successful!');
        } else {
          responseHandler.responseWithData(res, 401, { message: "Can't add new user" });
        }
      } else {
        responseHandler.unauthorized(res);
      }
    } catch (error) {
      responseHandler.badRequest(res, error.message);
    }
  },
  async requestRefreshToken(req, res) {
    const refreshAccessToken = req.cookie.refreshAccessToken;
    if (!refreshAccessToken) {
      responseHandler.unauthorized(res);
    } else {
      jwt.verify(refreshAccessToken, process.env.JWT_REFRESH_SECRET_TOKEN, (error, user) => {
        if (error) {
          responseHandler.badRequest(res, error.message);
        } else {
          const newAccessToken = generateAccessToken(user);
          const newRefreshAccessToken = generateRefreshToken(user);
          res.cookie('refreshAccessToken', newRefreshAccessToken, {
            httpOnly: true,
            path: '/',
            sameSite: 'strict',
            secure: false,
          });
          responseHandler.responseWithData(res, 200, newAccessToken);
        }
      });
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
          },
        });
        if (getUser) {
          const validPassword = bcrypt.compareSync(password, getUser.password);
          if (!validPassword) {
            responseHandler.responseWithData(res, 401, { message: 'Password was wrong' });
          } else {
            const accessToken = generateAccessToken(getUser);
            const refreshAccessToken = generateRefreshToken(getUser);
            res.cookie('refreshAccessToken', refreshAccessToken, {
              httpOnly: true,
              path: '/',
              sameSite: 'strict',
              secure: false,
            });
            delete getUser.dataValues.password;
            delete getUser._previousDataValues.password;
            responseHandler.responseWithData(res, 200, {
              ...getUser,
              accessToken,
              message: 'Login successful!',
            });
          }
        } else {
          responseHandler.responseWithData(res, 401, { message: 'User not exist' });
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
            attributes: ['phone', 'email'],
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
        responseHandler.responseWithData(res, 401, verifyOTPCode);
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
                attributes: ['phone', 'user_name', 'email'],
              },
            });
            const salt = bcrypt.genSalt(10);
            const hashPassword = bcrypt.hashSync(password, salt);
            if (getUser) {
              let updateUser = await User.update(
                { password: hashPassword },
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
              responseHandler.responseWithData(res, 200, { message: 'User does not exist!' });
            }
          } else {
            responseHandler.responseWithData(res, 401, {
              message: 'password not equal to password',
            });
          }
        } else {
          responseHandler.responseWithData(res, 401, {
            message: 'password can not null',
          });
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
            attributes: ['id', 'email', 'phone', 'user_name', 'avatar', 'role_id'],
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
          responseHandler.responseWithData(res, 401, { message: "Can't get list user" });
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
        attributes: ['id', 'email', 'phone', 'user_name', 'avatar', 'role_id'],
      });
      if (getUserById) {
        responseHandler.responseWithData(res, 200, getUserById);
      } else {
        responseHandler.responseWithData(res, 401, { message: "Can't get user information" });
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
        responseHandler.ok(res, 'Update user successful!');
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
          responseHandler.ok(res, 'Delete user successful!');
        } else {
          responseHandler.responseWithData(res, 401, { message: "Can't delete user" });
        }
      } else {
        responseHandler.unauthorized(res);
      }
    } catch (error) {
      responseHandler.badRequest(res, { message: error.message });
    }
  },
};
