const db = require('../models');
const crypto = require('crypto');
const cypherKey = crypto.randomBytes(64);

const User = db.users;
const Office = db.offices;
const Op = db.Sequelize.Op;
const OTPCode = require('../helper/OTPCode');
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
    try {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = bcrypt.hashSync(params.password, salt);
      const newUser = {
        ...params,
        password: hashPassword,
      };
      const createUser = await User.create(newUser);
      if (createUser) {
        return responseHandler.ok(res, 'Create user successful!');
      } else {
        return responseHandler.responseWithData(res, 403, { message: "Can't add new user" });
      }
    } catch (error) {
      return responseHandler.badRequest(res, error.message);
    }
  },
  async requestRefreshToken(req, res) {
    const refreshAccessToken = req.cookie.refreshAccessToken;
    if (!refreshAccessToken) {
      return responseHandler.unauthorized(res);
    } else {
      try {
        const getUser = await User.findOne({
          where: {
            email: req.body?.email,
          },
        });
        if (getUser) {
          jwt.verify(refreshAccessToken, process.env.JWT_REFRESH_SECRET_TOKEN, (error, user) => {
            if (error) {
              return responseHandler.badRequest(res, error.message);
            } else {
              const newAccessToken = generateAccessToken(user);
              const newRefreshAccessToken = generateRefreshToken(user);
              res.cookie('refreshAccessToken', newRefreshAccessToken, {
                httpOnly: true,
                path: '/',
                sameSite: 'strict',
                secure: false,
              });
              return responseHandler.responseWithData(res, 200, newAccessToken);
            }
          });
        } else {
          return responseHandler.unauthorized(res);
        }
      } catch (error) {
        return responseHandler.badRequest(res, error.message);
      }
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
            return responseHandler.responseWithData(res, 403, {
              message: 'Password was wrong',
            });
          } else {
            const accessToken = generateAccessToken(getUser);
            const refreshAccessToken = generateRefreshToken(getUser);
            const [updateRefreshToken, getOffice] = await Promise.all([
              User.update(
                {
                  refresh_access_token: refreshAccessToken,
                },
                {
                  where: {
                    [Op.or]: [{ email: user }, { phone: user }],
                  },
                }
              ),
              Office.findOne({
                where: {
                  id: getUser.office_id,
                },
              }),
            ]);
            if (getOffice) {
              getUser.dataValues.office = getOffice;
            }
            res.cookie('refreshAccessToken', refreshAccessToken, {
              httpOnly: true,
              path: '/',
              sameSite: 'strict',
              secure: false,
            });
            delete getUser.dataValues.password;
            delete getUser._previousDataValues.password;
            delete getUser.dataValues.refresh_access_token;
            delete getUser._previousDataValues.refresh_access_token;
            return responseHandler.responseWithData(res, 200, {
              ...getUser,
              accessToken,
              message: 'Login successful!',
            });
          }
        } else {
          return responseHandler.responseWithData(res, 403, { message: 'User not exist' });
        }
      } else {
        return responseHandler.responseWithData(res, 200, 'User and password can not empty');
      }
    } catch (error) {
      return responseHandler.badRequest(res, error.message);
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
          attributes: ['phone', 'email'],
        });
        let hashData = await OTPCode.sendCodeOTP(getUser.phone);
        return responseHandler.responseWithData(res, 200, hashData);
      } else {
        throw { message: 'Data is not null' };
      }
    } catch (error) {
      return responseHandler.badRequest(res, error.message);
    }
  },

  async verifyCodeOTP(req, res) {
    try {
      const params = req.body;
      const phone = params.phone;
      const otpCode = params.otpCode;
      const hash = params.hash;

      let verifyOTPCode = await OTPCode.verifyCodeOTP(phone, otpCode, hash);
      if (verifyOTPCode.success) {
        return responseHandler.responseWithData(res, 200, { phone, verifyOTPCode });
      } else {
        return responseHandler.responseWithData(res, 401, verifyOTPCode);
      }
    } catch (error) {
      return responseHandler.badRequest(res, error.message);
    }
  },

  async changePassword(req, res) {
    const params = req.body;
    const password = params.password;
    const user = params.user;
    const verifyOTPCode = params.verifyOTPCode;
    const confirmPassword = params.confirm_password;
    try {
      if (verifyOTPCode.success && verifyOTPCode.messages == 'Correct OTP Code') {
        if (confirmPassword && password) {
          if (password === confirmPassword) {
            let getUser = await User.findOne({
              where: {
                [Op.or]: [{ email: user }, { phone: user }],
              },
              attributes: ['phone', 'user_name', 'email'],
            });
            const salt = await bcrypt.genSalt(10);
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
                return responseHandler.ok(res, 'Update user successful!');
              } else {
                return responseHandler.error(res);
              }
            } else {
              return responseHandler.responseWithData(res, 403, {
                message: 'User does not exist!',
              });
            }
          } else {
            return responseHandler.responseWithData(res, 403, {
              message: 'password not equal to password',
            });
          }
        } else {
          return responseHandler.responseWithData(res, 403, {
            message: 'password can not null',
          });
        }
      } else {
        return responseHandler.unauthorized(res);
      }
    } catch (error) {
      return responseHandler.badRequest(res, error.message);
    }
  },

  async getListUser(req, res) {
    const params = req.body;
    const limit = params.limit;
    const offset = params.offset;
    const querySearch = params.query_search;
    const role_id = params.role_id;

    try {
      let attributes = ['id', 'email', 'phone', 'user_name', 'avatar', 'role_id', 'office_id'];
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
          attributes: attributes,
        }),
        User.count({
          where: whereCondition,
        }),
      ]);
      if (getUser) {
        for (let i = 0; i < getUser.length; i++) {
          const getOffice = await Office.findOne({
            where: {
              id: getUser[i].office_id,
            },
          });
          if (getOffice) {
            getUser[i].dataValues.office = getOffice;
          }
        }
        return responseHandler.responseWithData(res, 200, {
          list_user: getUser,
          number_user: numberUSer,
        });
      } else {
        return responseHandler.responseWithData(res, 403, { message: "Can't get list user" });
      }
    } catch (error) {
      return responseHandler.badRequest(res, error.message);
    }
  },
  async getUserInformation(req, res) {
    const params = req.body;
    try {
      const getUserById = await User.findOne({
        where: {
          id: params.id,
        },
        attributes: ['id', 'email', 'phone', 'user_name', 'avatar', 'role_id', 'office_id'],
      });
      if (getUserById) {
        const getOffice = await Office.findOne({
          where: {
            id: getUserById.office_id,
          },
        });
        if (getOffice) {
          getUserById.dataValues.office = getOffice;
        }
        return responseHandler.responseWithData(res, 200, getUserById);
      } else {
        return responseHandler.responseWithData(res, 401, {
          message: "Can't get user information",
        });
      }
    } catch (error) {
      return responseHandler.badRequest(res, error.message);
    }
  },
  async updateInformationUser(req, res) {
    const params = req.body;
    const id = params.id;
    try {
      let updateUser = await User.update(params, {
        where: {
          id: id,
        },
      });
      if (updateUser) {
        return responseHandler.ok(res, 'Update user successful!');
      } else {
        return responseHandler.responseWithData(res, 403, "Can't update user information");
      }
    } catch (error) {
      return responseHandler.badRequest(res, error.message);
    }
  },
  async deleteUser(req, res) {
    const params = req.body;
    const id = params.id;
    try {
      const deleteUser = await User.destroy({
        where: {
          id: id,
        },
      });
      if (deleteUser) {
        return responseHandler.ok(res, 'Delete user successful!');
      } else {
        return responseHandler.responseWithData(res, 403, { message: "Can't delete user" });
      }
    } catch (error) {
      return responseHandler.badRequest(res, error.message);
    }
  },
};
