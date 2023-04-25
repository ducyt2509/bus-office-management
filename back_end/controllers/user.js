const db = require('../models');
const crypto = require('crypto');

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
    { expiresIn: '8h' }
  );
};
const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      role_id: user.role_id,
    },
    process.env.JWT_SECRET_TOKEN,
    { expiresIn: '4h' }
  );
};

module.exports = {
  async createNewUser(req, res) {
    try {
      let { email, password, user_name, phone, avatar, role_id, office_id } = req.body;
      let condition =
        !validateHandler.validateString(email, regexHandler.regexEmail) ||
        !validateHandler.validateString(user_name, regexHandler.regexNormalString) ||
        !validateHandler.validateString(phone, regexHandler.regexPhoneNumber) ||
        !validateHandler.validateString(password, regexHandler.regexPassword);
      if (!email) {
        !validateHandler.validateString(user_name, regexHandler.regexNormalString) ||
          !validateHandler.validateString(phone, regexHandler.regexPhoneNumber) ||
          !validateHandler.validateString(password, regexHandler.regexPassword);
      }
      if (condition) return responseHandler.badRequest(res, 'Thông tin nhập không đúng yêu cầu');
      const role = await Role.findOne({
        where: {
          id: role_id,
        },
      });
      if (!role) return responseHandler.badRequest(res, 'Chức vụ không tồn tại');
      const salt = await bcrypt.genSalt(10);
      const hashPassword = bcrypt.hashSync(password, salt);
      let newUser = {
        email,
        user_name,
        phone,
        avatar: null,
        role_id,
        password: hashPassword,
        office_id,
        refresh_access_token: null,
      };
      if (parseInt(role_id) == 3) {
        newUser = {
          ...newUser,
          office_id: null,
        };
      } else {
        if (!validateHandler.validatePositiveIntegerNumber(parseInt(office_id)))
          return responseHandler.badRequest(res, 'Thông tin nhập không đúng yêu cầu');
        const getOffice = await Office.findOne({ where: { id: office_id } });
        if (!getOffice) return responseHandler.badRequest(res, 'Văn phòng không tồn tại');
      }

      const checkUserExist = await User.findOne({
        where: {
          [Op.or]: [{ email }, { phone }],
        },
      });

      if (checkUserExist) {
        return responseHandler.badRequest(res, 'Người dùng đã tồn tại');
      }

      const createUser = await User.create(newUser);
      if (createUser) {
        return responseHandler.ok(res, 'Tạo mới người dùng thành công!');
      } else {
        return responseHandler.badRequest(res, 'Thêm người dùng thất bại');
      }
    } catch (error) {
      responseHandler.badRequest(res, 'Có lỗi xảy ra khi thao tác. Vui lòng thử lại');
    }
  },
  async requestRefreshToken(req, res) {
    const refreshAccessToken = req.cookies.refreshAccessToken;
    if (!refreshAccessToken) {
      return responseHandler.unauthorized(res);
    } else {
      try {
        const getUser = await User.findOne({
          where: {
            id: req.body?.id,
          },
        });
        if (getUser && getUser.refresh_access_token == refreshAccessToken) {
          jwt.verify(
            refreshAccessToken,
            process.env.JWT_REFRESH_SECRET_TOKEN,
            async (error, user) => {
              if (error) {
                responseHandler.badRequest(res, 'Có lỗi xảy ra khi thao tác. Vui lòng thử lại');
              } else {
                const newAccessToken = generateAccessToken(user);
                const newRefreshAccessToken = generateRefreshToken(user);
                await User.update(
                  { refresh_access_token: newRefreshAccessToken },
                  { where: { id: req.body?.id } }
                );
                res.cookie('refreshAccessToken', newRefreshAccessToken, {
                  httpOnly: true,
                  sameSite: 'strict',
                  secure: false,
                });
                return responseHandler.responseWithData(res, 200, newAccessToken);
              }
            }
          );
        } else {
          return responseHandler.unauthorized(res);
        }
      } catch (error) {
        responseHandler.badRequest(res, 'Có lỗi xảy ra khi thao tác. Vui lòng thử lại');
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
        return responseHandler.badRequest(res, 'Thông tin nhập không đúng yêu cầu');

      const getUser = await User.findOne({
        where: {
          [Op.or]: [{ email: user }, { phone: user }],
        },
      });
      if (getUser) {
        const validPassword = bcrypt.compareSync(password, getUser.password);
        if (!validPassword) {
          return responseHandler.badRequest(res, 'Mật khẩu không đúng');
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
            message: 'Đăng nhập thành công!',
          });
        }
      } else {
        return responseHandler.badRequest(res, 'Người dùng không tồn tại');
      }
    } catch (error) {
      responseHandler.badRequest(res, 'Có lỗi xảy ra khi thao tác. Vui lòng thử lại');
    }
  },

  async sendCodeOTP(req, res) {
    try {
      const params = req.body;
      const user = params.user;
      if (!validateHandler.validateString(user, regexHandler.regexPhoneNumberOrEmail))
        return responseHandler.badRequest(res, 'Thông tin nhập không đúng yêu cầu');
      let getUser = await User.findOne({
        where: {
          [Op.or]: [{ email: user }, { phone: user }],
        },
        attributes: ['phone', 'email'],
      });
      if (!getUser) return responseHandler.badRequest(res, 'Người dùng không tồn tại');
      let hashData = await OTPCode.sendCodeOTP(getUser.phone);
      return responseHandler.responseWithData(res, 200, hashData);
    } catch (error) {
      responseHandler.badRequest(res, 'Có lỗi xảy ra khi thao tác. Vui lòng thử lại');
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
        return responseHandler.responseWithData(res, 401, 'Mã xác thực không đúng');
      }
    } catch (error) {
      responseHandler.badRequest(res, 'Có lỗi xảy ra khi thao tác. Vui lòng thử lại');
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
        return responseHandler.badRequest(res, 'Thông tin nhập không đúng yêu cầu');
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
              return responseHandler.ok(res, 'Cập nhật thông tin người dùng thành công!');
            } else {
              return responseHandler.error(res);
            }
          } else {
            return responseHandler.badRequest(res, {
              message: 'Người dùng không tồn tại',
            });
          }
        } else {
          return responseHandler.responseWithData(res, 403, {
            message: 'Xác nhận mật khẩu không đúng',
          });
        }
      } else {
        return responseHandler.unauthorized(res);
      }
    } catch (error) {
      responseHandler.badRequest(res, 'Có lỗi xảy ra khi thao tác. Vui lòng thử lại');
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
        return responseHandler.badRequest(res, 'Thông tin nhập không đúng yêu cầu');

      if (role_id && role_id !== null) {
        const role = await Role.findOne({
          where: {
            id: role_id,
          },
        });
        if (!role) return responseHandler.badRequest(res, 'Chức vụ không tồn tại');
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
      or (phone like '%${querySearch}%') order  by id desc limit ${limit} offset ${offset}`;
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
        and user.role_id = ${role_id} order  by id desc`;

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
          return responseHandler.badRequest(res, 'Người dùng không tồn tại');
        }
        //NOTE
        return responseHandler.badRequest(res, '');
      }
    } catch (error) {
      responseHandler.badRequest(res, 'Có lỗi xảy ra khi thao tác. Vui lòng thử lại');
    }
  },
  async getUserInformation(req, res) {
    try {
      const { id } = req.body;
      if (!validateHandler.validatePositiveIntegerNumber(parseInt(id)))
        return responseHandler.badRequest(res, 'Thông tin nhập không đúng yêu cầu');

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
        return responseHandler.badRequest(res, 'Người dùng không tồn tại');
      }
    } catch (error) {
      responseHandler.badRequest(res, 'Có lỗi xảy ra khi thao tác. Vui lòng thử lại');
    }
  },
  async updateInformationUser(req, res) {
    try {
      let { email, password, user_name, phone, role_id, id } = req.body;

      let condition =
        !validateHandler.validateString(email, regexHandler.regexEmail) ||
        !validateHandler.validateString(user_name, regexHandler.regexNormalString) ||
        !validateHandler.validateString(phone, regexHandler.regexPhoneNumber) ||
        !validateHandler.validateString(password, regexHandler.regexPassword) ||
        !validateHandler.validatePositiveIntegerNumber(parseInt(role_id));

      if (!password) {
        condition =
          !validateHandler.validateString(email, regexHandler.regexEmail) ||
          !validateHandler.validateString(user_name, regexHandler.regexNormalString) ||
          !validateHandler.validateString(phone, regexHandler.regexPhoneNumber) ||
          !validateHandler.validatePositiveIntegerNumber(parseInt(role_id));
      }
      if (condition) return responseHandler.badRequest(res, 'Thông tin nhập không đúng yêu cầu');

      const role = await Role.findOne({
        where: {
          id: role_id,
        },
      });
      if (!role) return responseHandler.badRequest(res, 'Chức vụ không tồn tại');
      const getUser = await User.findOne({
        where: { id },
      });
      if (!getUser) return responseHandler.badRequest(res, 'Người dùng không tồn tại');

      if (getUser.dataValues.phone != phone) {
        const checkPhoneExist = await User.findOne({
          where: { phone },
        });
        if (checkPhoneExist) return responseHandler.badRequest(res, 'Số điện thoại đã tồn tại');

      }
      if (getUser.dataValues.email != email) {
        const checkEmailExist = await User.findOne({
          where: { email },
        });
        if (checkEmailExist) return responseHandler.badRequest(res, 'Email đã tồn tại');
      }
      let hashPassword = '';
      let element = { email, password, user_name, phone, role_id };

      if (password) {
        const salt = await bcrypt.genSalt(10);
        hashPassword = bcrypt.hashSync(password, salt);
        element.password = hashPassword;
      } else {
        delete element.password;
      }

      let updateUser = await User.update(element, {
        where: {
          id: id,
        },
      });
      if (updateUser) {
        return responseHandler.ok(res, 'Cập nhật thông tin người dùng thành công!');
      } else {
        return responseHandler.badRequest(res, 'Không thể cập nhật thông tin người dùng');
      }
    } catch (error) {
      responseHandler.badRequest(res, 'Có lỗi xảy ra khi thao tác. Vui lòng thử lại');
    }
  },
  async deleteUser(req, res) {
    try {
      const params = req.body;
      const id = params.id;
      if (!validateHandler.validatePositiveIntegerNumber(parseInt(id)))
        return responseHandler.badRequest(res, 'Thông tin nhập không đúng yêu cầu');
      const deleteUser = await User.destroy({
        where: {
          id: id,
        },
      });
      if (deleteUser) {
        return responseHandler.ok(res, 'Xoá người dùng thành công!');
      } else {
        return responseHandler.badRequest(res, 'Người dùng không tồn tại');
      }
    } catch (error) {
      responseHandler.badRequest(res, 'Có lỗi xảy ra khi thao tác. Vui lòng thử lại');
    }
  },
  async logoutAccount(req, res) {
    try {
      const deleteRefreshToken = await User.update(
        { refresh_access_token: null },
        { where: { id: req.body.id } }
      );
      if (deleteRefreshToken) {
        res.clearCookie('dataUser');
        res.clearCookie('refreshAccessToken');
        res.clearCookie('sideBarActive');
        return responseHandler.ok(res, 'Đăng xuất thành công!');
      } else {
        return responseHandler.badRequest(res, 'Không thể đăng xuẩt');
      }
    } catch (err) {
      responseHandler.badRequest(res, 'Có lỗi xảy ra khi thao tác. Vui lòng thử lại');
    }
  },
};
