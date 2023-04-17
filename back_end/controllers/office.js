const db = require("../models");
const Office = db.offices;
const User = db.users;
const City = db.cities;
const QueryTypes = db.Sequelize.QueryTypes;
const Op = db.Sequelize.Op;
const responseHandler = require("../handlers/response.handler");
const validateHandler = require('../handlers/validate.handler');
const messageHandler = require('../handlers/message.handler');
const regexHandler = require('../handlers/regex.handler');

const checkExistOffice = async (office_name, city_id, office_address) => {
	const getOffice = await Office.findOne({
		where: {
			[Op.and]: [{
				office_name,
			}, {
				city_id,
			}, {
				office_address
				,
			}]
		}
	})
	if (getOffice) return true;
	return false;
}


module.exports = {
	async createNewOffice(req, res) {

		try {
			const { office_name,
				city_id,
				office_address } = req.body;

			if (!validateHandler.validateString(office_name, regexHandler.regexNormalString) ||
				!validateHandler.validatePositiveIntegerNumber(parseInt(city_id)) ||
				!validateHandler.validateString(office_address, regexHandler.regexNormalString))
				return responseHandler.badRequest(res, messageHandler.messageValidateFailed);

			const getCity = await City.findOne({
				id: city_id
			})
			if (!getCity) return responseHandler.badRequest(res, "City not found");

			const isExist = await checkExistOffice(office_name,
				city_id,
				office_address)
			if (isExist) return responseHandler.badRequest(res, "Office already exists");
			const createOffice = await Office.create(params);
			if (createOffice) {
				return responseHandler.ok(res, { message: "Create office successful!" });
			} else {
				return responseHandler.badRequest(res, "Cant create office");
			}
		} catch (error) {
			return responseHandler.error
		}
	},
	async updateOfficeInformation(req, res) {
		try {
			const { id, office_name,
				city_id,
				office_address, } = req.body;

			if (!validateHandler.validateString(office_name, regexHandler.regexNormalString) ||
				!validateHandler.validatePositiveIntegerNumber(parseInt(city_id)) ||
				!validateHandler.validatePositiveIntegerNumber(parseInt(id)) ||
				!validateHandler.validateString(office_address, regexHandler.regexNormalString))
				return responseHandler.badRequest(res, messageHandler.messageValidateFailed);

			const getCity = await City.findOne({
				id: city_id
			})
			if (!getCity) return responseHandler.badRequest(res, "City not found");
			const isExist = await checkExistOffice(office_name,
				city_id,
				office_address)
			if (isExist) return responseHandler.badRequest(res, "Office already exists");

			const officeData = {
				id, office_name,
				city_id,
				office_address,
			};
			delete officeData.role_id;
			const updateOffice = await Office.update(officeData, {
				where: {
					id
				},
			});
			if (updateOffice) {
				return responseHandler.ok(res, { message: "Update office successful!" });
			} else {
				return responseHandler.badRequest(res, "Cant update office")
			}
		} catch (error) {
			return responseHandler.error
		}
	},
	async deleteOfficeInformation(req, res) {
		try {
			const { id } = req.body;
			if (!validateHandler.validatePositiveIntegerNumber(parseInt(id))) return responseHandler.badRequest(res, messageHandler.messageValidateFailed)

			const deleteOffice = await Office.destroy({
				where: {
					id: params.id,
				},
			});
			if (deleteOffice) {
				return responseHandler.ok(res, { message: "Delete office successful!" });
			} else {
				return responseHandler.badRequest(res, "Office not found")
			}
		} catch (error) {
			return responseHandler.error
		}
	},
	async getListOffice(req, res) {
		try {
			var { limit, offset, query_search, route } = req.body
			limit = limit ? limit : 7
			offset = offset ? offset : 0
			const querySearch = !query_search ? "" : query_search.toString().trim()


			if (!validateHandler.validatePositiveIntegerNumber(parseInt(limit)) || !validateHandler.validatePositiveIntegerNumber(parseInt(offset)))
				return responseHandler.badRequest(res, messageHandler.messageValidateFailed)


			const querySQL = `select office.id, office_name, city_id, office_address from office join city c on office.city_id = c.id 
      where (office_name like '%${querySearch}%') 
      or (office_address like '%${querySearch}%') 
      or (c.city_name like '%${querySearch}%') limit ${limit} offset ${offset}`;
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
					number_office: numberOffice[0]["numberOffice"],
				});
			} else {
				return responseHandler.badRequest(res, "Cant get list office");
			}
		} catch (error) {
			return responseHandler.error
		}
	},
	async getOfficeInformation(req, res) {
		try {
			const params = req.body;
			const id = params.id;
			if (!validateHandler.validatePositiveIntegerNumber(parseInt(id))) return responseHandler.badRequest(res, messageHandler.messageValidateFailed)

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
						attributes: ["id", "user_name"],
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
				return responseHandler.badRequest(res, "Office not found");
			}
		} catch (error) {
			return responseHandler.error
		}
	},
};
