const db = require('../models');
const Office = db.offices;
const User = db.users;
const City = db.cities;
const QueryTypes = db.Sequelize.QueryTypes;
const Op = db.Sequelize.Op;
const responseHandler = require('../handlers/response.handler');
const validateHandler = require('../handlers/validate.handler');
const messageHandler = require('../handlers/message.handler');
const regexHandler = require('../handlers/regex.handler');

const checkExistOffice = async (office_name, city_id, office_address) => {
  const getOffice = await Office.findOne({
    where: {
      [Op.and]: [
        {
          office_name,
        },
        {
          city_id,
        },
        {
          office_address,
        },
      ],
    },
  });
  if (getOffice) return true;
  return false;
};

module.exports = {
  async createNewOffice(req, res) {
    try {
      const { office_name, city_id, office_address } = req.body;

      if (
        !validateHandler.validateString(office_name, regexHandler.regexNormalString) ||
        !validateHandler.validatePositiveIntegerNumber(parseInt(city_id)) ||
        !validateHandler.validateString(office_address, regexHandler.regexNormalString)
      )
        return responseHandler.badRequest(res, messageHandler.messageValidateFailed);

      const getCity = await City.findOne({
        id: city_id,
      });
      if (!getCity) return responseHandler.badRequest(res, 'City not found');

      const isExist = await checkExistOffice(office_name, city_id, office_address);
      if (isExist) return responseHandler.badRequest(res, 'Office already exists');
      const createOffice = await Office.create({ office_name, city_id, office_address });
      if (createOffice) {
        return responseHandler.ok(res, { message: 'Tạo văn phòng thành công!' });
      } else {
        return responseHandler.badRequest(res, 'Không thể tạo văn phòng');
      }
    } catch (error) {
      responseHandler.badRequest(res, 'Có lỗi xảy ra khi thao tác. Vui lòng thử lại');
    }
  },
  async updateOfficeInformation(req, res) {
    try {
      const { id, office_name, city_id, office_address } = req.body;

      if (
        !validateHandler.validateString(office_name, regexHandler.regexNormalString) ||
        !validateHandler.validatePositiveIntegerNumber(parseInt(city_id)) ||
        !validateHandler.validatePositiveIntegerNumber(parseInt(id)) ||
        !validateHandler.validateString(office_address, regexHandler.regexNormalString)
      )
        return responseHandler.badRequest(res, messageHandler.messageValidateFailed);

      // check city
      const getCity = await City.findOne(
        {
          where: {
            id: city_id,
          }
        });
      if (!getCity) return responseHandler.badRequest(res, 'Thành phố không tồn tại');

      //check office is exist ? 
      const getOffice = await Office.findOne({
        where: { id },
      });
      if (!getOffice) return responseHandler.badRequest(res, 'Văn phòng không tồn tại');

      if (getOffice.boffice_address != office_address) {
        const isAddressExist = await await Office.findOne({
          where: { office_address },
        });
        if (isAddressExist) return responseHandler.badRequest(res, 'Địa chỉ văn phòng đã tồn tại');
      }
      if (getOffice.dataValues.office_name != office_name) {
        const isNameExist = await await Office.findOne({
          where: { office_name },
        });
        if (isNameExist) return responseHandler.badRequest(res, 'Tên văn phòng đã tồn tại');
      }

      const officeData = {
        id,
        office_name,
        city_id,
        office_address,
      };
      delete officeData.role_id;
      const updateOffice = await Office.update(officeData, {
        where: {
          id,
        },
      });
      if (updateOffice) {
        return responseHandler.ok(res, { message: 'Cập nhật văn phòng thành công!' });
      } else {
        return responseHandler.badRequest(res, 'Không thể cập nhật văn phòng');
      }
    } catch (error) {
      responseHandler.badRequest(res, 'Có lỗi xảy ra khi thao tác. Vui lòng thử lại');
    }
  },
  async deleteOfficeInformation(req, res) {
    try {
      const { id } = req.body;
      if (!validateHandler.validatePositiveIntegerNumber(parseInt(id)))
        return responseHandler.badRequest(res, messageHandler.messageValidateFailed);

      const deleteOffice = await Office.destroy({
        where: {
          id: id,
        },
      });
      if (deleteOffice) {
        return responseHandler.ok(res, { message: 'Xoá văn phòng thành công!' });
      } else {
        return responseHandler.badRequest(res, 'Văn phòng không tồn tại');
      }
    } catch (error) {
      responseHandler.badRequest(res, 'Có lỗi xảy ra khi thao tác. Vui lòng thử lại');
    }
  },
  async getListOffice(req, res) {
    try {
      var { limit, offset, query_search, route } = req.body;
      limit = limit ? limit : 7;
      offset = offset ? offset : 0;
      const querySearch = !query_search ? '' : query_search.toString().trim();

      if (
        !validateHandler.validatePositiveIntegerNumber(parseInt(limit)) ||
        !validateHandler.validatePositiveIntegerNumber(parseInt(offset))
      )
        return responseHandler.badRequest(res, messageHandler.messageValidateFailed);

      const querySQL = `select office.id, office_name, city_id, office_address from office join city c on office.city_id = c.id 
      where (office_name like '%${querySearch}%') 
      or (office_address like '%${querySearch}%') 
      or (c.city_name like '%${querySearch}%') order  by id desc limit ${limit} offset ${offset}`;
      const queryCount = `select count(*) as numberOffice from office join city c on c.id = office.city_id  
      where (office_name like '%${querySearch}%') 
      or (office_address like '%${querySearch}%') 
      or (c.city_name like '%${querySearch}%')`;

      const [listOffice, numberOffice] = await Promise.all([
        db.sequelize.query(querySQL, { type: QueryTypes.SELECT }),
        db.sequelize.query(queryCount, { type: QueryTypes.SELECT }),
      ]);
      if (listOffice) {
        for (let i = 0; i < listOffice.length; i++) {
          const [numberEmployee, getCity] = await Promise.all([
            User.count({
              where: {
                office_id: listOffice[i].id,
              },
            }),
            City.findOne({
              where: {
                id: listOffice[i].city_id,
              },
            }),
          ]);
          if (numberEmployee) {
            listOffice[i].number_employee = numberEmployee;
          }
          if (getCity) {
            listOffice[i].city = getCity;
          }
        }
        return responseHandler.responseWithData(res, 200, {
          list_office: listOffice,
          number_office: numberOffice[0]['numberOffice'],
        });
      } else {
        return responseHandler.badRequest(res, 'Không thể lấy danh sách văn phòng');
      }
    } catch (error) {
      responseHandler.badRequest(res, 'Có lỗi xảy ra khi thao tác. Vui lòng thử lại');
    }
  },
  async getOfficeInformation(req, res) {
    try {
      const params = req.body;
      const id = params.id;
      if (!validateHandler.validatePositiveIntegerNumber(parseInt(id)))
        return responseHandler.badRequest(res, messageHandler.messageValidateFailed);

      const officeInformation = await Office.findOne({
        where: {
          id: id,
        },
      });
      if (officeInformation) {
        const [numberEmployee, getCity] = await Promise.all([
          User.findAll({
            where: {
              office_id: officeInformation.id,
            },
            attributes: ['id', 'user_name'],
          }),
          City.findOne({
            where: {
              id: officeInformation.city_id,
            },
          }),
        ]);
        if (numberEmployee) {
          officeInformation.dataValues.number_employee = numberEmployee;
        }
        if (getCity) {
          officeInformation.dataValues.city = getCity;
        }
        return responseHandler.responseWithData(res, 200, officeInformation);
      } else {
        return responseHandler.badRequest(res, 'Văn phòng không tồn tại');
      }
    } catch (error) {
      responseHandler.badRequest(res, 'Có lỗi xảy ra khi thao tác. Vui lòng thử lại');
    }
  },
};
