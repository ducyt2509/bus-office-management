const db = require("../models");
const BUS_TYPE = db.bus_types;
const Op = db.Sequelize.Op;
const responseHandler = require("../handlers/response.handler");

module.exports = {
	async getAll(req, res) {
		try {
			const list = await BUS_TYPE.findAll();
			responseHandler.responseWithData(res, 200, list);
		} catch (error) {
			responseHandler.error(res);
		}
	},
	async addNewBusType(req, res) {
		try {
			if (!req.body.name) throw { message: "Data is not null" };
			let newBusType = await BUS_TYPE.create({
				bus_type_name: req.body.name,
			});
			responseHandler.ok(res, "Add new bus type successfully!");
		} catch (error) {
			responseHandler.badrequest(res, error.message);
		}
	},

	async deleteBusType(req, res) {
		try {
			let bustype = await BUS_TYPE.findAll({
				where: {
					id: req.query?.id,
				},
			});
			if (!bustype) return responseHandler.notfound(res);
			await BUS_TYPE.destroy({
				where: {
					id: req.query?.id,
				},
			});
			responseHandler.ok(res, "Delete bus type successfully");
		} catch (error) {
			responseHandler.error(res);
		}
	},
};
