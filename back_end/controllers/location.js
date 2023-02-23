const db = require("../models");
const LOCATION = db.locations;
const Op = db.Sequelize.Op;
const responseHandler = require("../handlers/response.handler");

module.exports = {
	async getAll(req, res) {
		try {
			const list = await LOCATION.findAll();
			responseHandler.responseWithData(res, 200, list);
		} catch (error) {
			responseHandler.error(res);
		}
	},

	async addNewLocation(req, res) {
		try {
			if (!req.body.name) throw { message: "Data is not null" };
			let newLocation = await LOCATION.create({
				location_name: req.body.name,
				city_id: req.body.city_id,
			});
			responseHandler.ok(res, "Add new location successfully!");
		} catch (error) {
			responseHandler.badRequest(res, error.message);
		}
	},

	async deleteLocation(req, res) {
		try {
			let location = await LOCATION.findAll({
				where: {
					id: req.query?.locationid,
				},
			});

			if (!location) return responseHandler.notfound(res);
			await LOCATION.destroy({
				where: {
					id: req.query?.id,
				},
			});
			responseHandler.ok(res, "Delete location successfully");
		} catch (error) {
			responseHandler.error(res);
		}
	},
};
