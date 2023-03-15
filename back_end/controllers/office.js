const db = require('../models');
const Office = db.offices;
const User = db.users;
const City = db.cities;
const QueryTypes = db.Sequelize.QueryTypes;
const Op = db.Sequelize.Op;
const responseHandler = require('../handlers/response.handler');

module.exports = {
  async createNewOffice(req, res) {
    const params = req.body;
    try {
      const createOffice = await Office.create(params);
      if (createOffice) {
        return responseHandler.ok(res, { message: 'Create office successful!' });
      } else {
        return responseHandler.error(res);
      }
    } catch (error) {
      return responseHandler.badRequest(res, error.message);
    }
  },
  async updateOfficeInformation(req, res) {
    const params = req.body;
    try {
      const officeData = { ...params };
      delete officeData.role_id;
      const updateOffice = await Office.update(officeData, {
        where: {
          id: params.id,
        },
      });
      if (updateOffice) {
        return responseHandler.ok(res, { message: 'Update office successful!' });
      } else {
        return responseHandler.error(res);
      }
    } catch (error) {
      return responseHandler.badRequest(res, error.message);
    }
  },
  async deleteOfficeInformation(req, res) {
    const params = req.body;
    try {
      const deleteOffice = await Office.destroy({
        where: {
          id: params.id,
        },
      });
      if (deleteOffice) {
        return responseHandler.ok(res, { message: 'Delete office successful!' });
      } else {
        return responseHandler.error(res);
      }
    } catch (error) {
      return responseHandler.badRequest(res, error.message);
    }
  },
  async getListOffice(req, res) {
    const params = req.body;
    const querySearch = params.query_search;
    const offset = params.offset;
    const limit = params.limit;
    try {
      const querySQL = `select office.id, office_name, city_id, office_address from office join city c on office.city_id = c.id 
      where (office_name like '%${querySearch}%') 
      or (office_address like '%${querySearch}%') 
      or (c.city_name like '%${querySearch}%') limit ${limit} offset ${offset}`;
      const queryCount = `select count(*) from office join city c on c.id = office.city_id  
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
          number_office: numberOffice[0]['count(*)'],
        });
      } else {
        return responseHandler.error(res);
      }
    } catch (error) {
      return responseHandler.badRequest(res, error.message);
    }
  },
  async getOfficeInformation(req, res) {
    const params = req.body;
    const id = params.id;
    try {
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
        return responseHandler.error(res);
      }
    } catch (error) {
      return responseHandler.badRequest(res, error.message);
    }
  },
};
