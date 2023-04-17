const db = require('../models');
const crypto = require('crypto');
const cypherKey = crypto.randomBytes(64);

const User = db.users;
const Role = db.roles;
const Office = db.offices;
const Op = db.Sequelize.Op;
const OTPCode = require('../helper/OTPCode');
const bcrypt = require('bcrypt');
const QueryTypes = db.Sequelize.QueryTypes;
const jwt = require('jsonwebtoken');
const responseHandler = require('../handlers/response.handler');

const regexHandler = require('../handlers/regex.handler');
const validateHandler = require('../handlers/validate.handler');
const messageHandler = require('../handlers/message.handler');

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
    try {
      const { email, password, user_name, phone, avatar, role_id } = req.body;
      if (
        !validateHandler.validateString(email, regexHandler.regexEmail) ||
        !validateHandler.validateString(user_name, regexHandler.regexNormalString) ||
        !validateHandler.validateString(phone, regexHandler.regexPhoneNumber) ||
        !validateHandler.validateString(password, regexHandler.regexPassword)
        // || !validateHandler.validateString(avatar, regexHandler.regexAvatar)
      )
        return responseHandler.badRequest(res, messageHandler.messageValidateFailed);
      const role = await Role.findOne({
        where: {
          id: role_id,
        },
      });
      if (!role) return responseHandler.badRequest(res, 'Role not found');

      const checkUserExist = await User.findOne({
        where: {
          [Op.or]: [{ email }, { phone }],
        },
      });

      if (checkUserExist) {
        return responseHandler.badRequest(res, 'User is already exist');
      }
      const salt = await bcrypt.genSalt(10);
      const hashPassword = bcrypt.hashSync(password, salt);
      const newUser = {
        email,
        user_name,
        phone,
        avatar,
        role_id,
        password: hashPassword,
      };
      const createUser = await User.create(newUser);
      if (createUser) {
        return responseHandler.ok(res, 'Create user successful!');
      } else {
        return responseHandler.badRequest(res, 'Create user failed');
      }
    } catch (error) {
      return responseHandler.error;
    }
  },
  async requestRefreshToken(req, res) {
    // const refreshAccessToken = req.cookie.refreshAccessToken;
    console.log(1, req.cookies);
    return;
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
                // httpOnly: true,
                // path: '/',
                // sameSite: 'strict',
                // secure: false,
              });
              return responseHandler.responseWithData(res, 200, newAccessToken);
            }
          });
        } else {
          return responseHandler.unauthorized(res);
        }
      } catch (error) {
        return responseHandler.error;
      }
    }
  },
  async loginAccount(req, res) {
    try {
      const params = req.body;
      const user = params.user;
      const password = params.password;
      if (
        !validateHandler.validateString(user, regexHandler.regexPhoneNumberOrEmail) ||
        // password not in range [8+] characters
        !validateHandler.validateString(password, regexHandler.regexPassword)
      )
        return responseHandler.badRequest(res, messageHandler.messageValidateFailed);

      const getUser = await User.findOne({
        where: {
          [Op.or]: [{ email: user }, { phone: user }],
        },
      });
      if (getUser) {
        const validPassword = bcrypt.compareSync(password, getUser.password);
        if (!validPassword) {
          return responseHandler.badRequest(res, 'Password was wrong');
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
        return responseHandler.badRequest(res, 'User not found');
      }
    } catch (error) {
      return responseHandler.error;
    }
  },

  async sendCodeOTP(req, res) {
    try {
      const params = req.body;
      const user = params.user;
      if (!validateHandler.validateString(user, regexHandler.regexPhoneNumberOrEmail))
        return responseHandler.badRequest(res, messageHandler.messageValidateFailed);
      let getUser = await User.findOne({
        where: {
          [Op.or]: [{ email: user }, { phone: user }],
        },
        attributes: ['phone', 'email'],
      });
      if (!getUser) return responseHandler.badRequest(res, 'User not found');
      let hashData = await OTPCode.sendCodeOTP(getUser.phone);
      return responseHandler.responseWithData(res, 200, hashData);
    } catch (error) {
      return responseHandler.error;
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
        return responseHandler.responseWithData(res, 401, 'Verify code is not available');
      }
    } catch (error) {
      return responseHandler.error;
    }
  },

  async changePassword(req, res) {
    const params = req.body;
    const password = params.password;
    const user = params.user;
    const verifyOTPCode = params.verifyOTPCode;
    const confirmPassword = params.confirm_password;
    try {
      if (
        !validateHandler.validateStringInRange(password, 8, 16, regexHandler.regexPassword) ||
        !validateHandler.validateStringInRange(password, 8, 16, regexHandler.confirmPassword) ||
        !validateHandler.validateString(user, regexHandler.regexPhoneNumberOrEmail)
      )
        return responseHandler.badRequest(res, messageHandler.messageValidateFailed);
      if (verifyOTPCode.success && verifyOTPCode.messages == 'Correct OTP Code') {
        if (password === confirmPassword) {
          let getUser = await User.findOne({
            where: {
              [Op.or]: [{ email: user }, { phone: user }],
            },
            attributes: ['phone', 'email'],
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
            return responseHandler.badRequest(res, {
              message: 'User not found',
            });
          }
        } else {
          return responseHandler.responseWithData(res, 403, {
            message: 'Password not equal to confirm password',
          });
        }
      } else {
        return responseHandler.unauthorized(res);
      }
    } catch (error) {
      return responseHandler.error;
    }
  },

  async getListUser(req, res) {
    try {
      var { limit, offset, query_search, role_id } = req.body;
      limit = limit ? limit : 7;
      offset = offset ? offset : 0;
      const querySearch = !query_search ? '' : query_search.toString().trim();
      role_id = role_id ? role_id : 0;

      if (
        !validateHandler.validatePositiveIntegerNumber(parseInt(limit)) ||
        !validateHandler.validatePositiveIntegerNumber(parseInt(offset))
      )
        return responseHandler.badRequest(res, messageHandler.messageValidateFailed);

      if (role_id && role_id !== null) {
        const role = await Role.findOne({
          where: {
            id: role_id,
          },
        });
        if (!role) return responseHandler.badRequest(res, 'Role not found');
      }
      let attributes = 'user.id, email, phone ,user_name, avatar, role_id, role_name , office_id';
      let querySQL =
        `select ` +
        attributes +
        ` from user 
      join role r on user.role_id = r.id
      where (user_name like '%${querySearch}%') 
      or (email like '%${querySearch}%')
      or (r.role_name like '%${querySearch}%') 
      or (phone like '%${querySearch}%') limit ${limit} offset ${offset}`;
      let queryCount = `select count(*) from user  
      join role r on user.role_id = r.id
      where (user_name like '%${querySearch}%') 
      or (email like '%${querySearch}%')
      or (r.role_name like '%${querySearch}%') 
      or (phone like '%${querySearch}%')`;
      if (role_id) {
        querySQL =
          `select ` +
          attributes +
          ` from user 
        join role r on user.role_id = r.id
        where ((user_name like '%${querySearch}%') 
        or (email like '%${querySearch}%')
        or (r.role_name like '%${querySearch}%') 
        or (phone like '%${querySearch}%')) 
        and user.role_id = ${role_id}`;

        queryCount = `select count(*) from user
        join role r on user.role_id = r.id
        where ((user_name like '%${querySearch}%') 
        or (email like '%${querySearch}%')
        or (r.role_name like '%${querySearch}%') 
        or (phone like '%${querySearch}%')) 
        and user.role_id = ${role_id}`;
      }
      let [getUser, numberUser] = await Promise.all([
        db.sequelize.query(querySQL, { type: QueryTypes.SELECT }),
        db.sequelize.query(queryCount, { type: QueryTypes.SELECT }),
      ]);
      if (getUser) {
        for (let i = 0; i < getUser.length; i++) {
          if (getUser[i].office_id != null) {
            const getOffice = await Office.findOne({
              where: {
                id: getUser[i].office_id,
              },
            });
            console.log(getOffice);
            if (getOffice) {
              getUser[i].office = getOffice;
            }
          } else {
            getUser[i].office = null;
          }
        }
        return responseHandler.responseWithData(res, 200, {
          list_user: getUser,
          number_user: numberUser[0]['count(*)'],
        });
      } else {
        if (querySearch && querySearch.length > 0) {
          return responseHandler.badRequest(res, 'User not found');
        }
        //NOTE
        return responseHandler.badRequest(res, '');
      }
    } catch (error) {
      return responseHandler.error;
    }
  },
  async getUserInformation(req, res) {
    try {
      const { id } = req.body;
      if (!validateHandler.validatePositiveIntegerNumber(parseInt(id)))
        return responseHandler.badRequest(res, messageHandler.messageValidateFailed);

      const getUserById = await User.findOne({
        where: {
          id,
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
        return responseHandler.badRequest(res, 'User not found');
      }
    } catch (error) {
      return responseHandler.error;
    }
  },
  async updateInformationUser(req, res) {
    try {
      let { email, password, user_name, phone, avatar, role_id, id } = req.body;
      if (
        !validateHandler.validateString(email, regexHandler.regexEmail) ||
        !validateHandler.validateString(user_name, regexHandler.regexNormalString) ||
        !validateHandler.validateString(phone, regexHandler.regexPhoneNumber) ||
        !validateHandler.validateString(password, regexHandler.regexPassword) ||
        !validateHandler.validatePositiveIntegerNumber(parseInt(role_id))
        // || !validateHandler.validateString(avatar, regexHandler.regexAvatar)
      )
        return responseHandler.badRequest(res, messageHandler.messageValidateFailed);
      const role = await Role.findOne({
        where: {
          id: role_id,
        },
      });
      if (!role) return responseHandler.badRequest(res, 'Role not found');
      const salt = await bcrypt.genSalt(10);
      const hashPassword = bcrypt.hashSync(password, salt);
      password = hashPassword;

      let updateUser = await User.update(
        { email, password, user_name, phone, role_id },
        {
          where: {
            id: id,
          },
        }
      );
      if (updateUser) {
        return responseHandler.ok(res, 'Update user successful!');
      } else {
        return responseHandler.badRequest(res, 'Cant update user');
      }
    } catch (error) {
      return responseHandler.error;
    }
  },
  async deleteUser(req, res) {
    try {
      const params = req.body;
      const id = params.id;
      if (!validateHandler.validateIntegerNumber(parseInt(id)))
        return responseHandler.badRequest(res, messageHandler.messageValidateFailed);

      const deleteUser = await User.destroy({
        where: {
          id: id,
        },
      });
      if (deleteUser) {
        return responseHandler.ok(res, 'Delete user successful!');
      } else {
        return responseHandler.badRequest(res, 'User not found');
      }
    } catch (error) {
      return responseHandler.error;
    }
  },
};
