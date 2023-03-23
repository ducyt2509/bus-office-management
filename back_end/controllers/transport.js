const db = require('../models');
const Transport = db.transports;
const Op = db.Sequelize.Op;
const responseHandler = require('../handlers/response.handler');
const QueryTypes = db.Sequelize.QueryTypes;

module.exports = {
    async getListTransport(req, res) {
        const params = req.body;
        const limit = !params?.limit ? 7 : params.limit;
        const offset = !params?.offset ? 0 : params.offset;
        const querySearch = !params?.query_search ? '' : params.query_search;
        try {
            const querySQL = `SELECT t.id  , vehicle_plate , bs.route_id , bs.time_from , t.departure_date , r.city_from_id , r.city_to_id , c.city_name as 'departure_city' , cc.city_name as 'arrive_city' FROM bom.transport t 
            join bus_schedule bs on bs.id = t.bus_schedule_id
            join  bus b on b.id = t.bus_id
join route r  on bs.route_id = r.id
join city c on r.city_from_id = c.id
join city cc on r.city_to_id = cc.id
;`;

            const queryCount = `SELECT count(*) FROM bom.transport`
            const [listTransport, numberTransport] = await Promise.all([
                db.sequelize.query(querySQL, { type: QueryTypes.SELECT }),
                db.sequelize.query(queryCount, { type: QueryTypes.SELECT }),
            ]);

            return responseHandler.responseWithData(res, 200, {
                list_transport: listTransport,
                number_transport: numberTransport[0]['count(*)'],
            });
        } catch (error) {
            return responseHandler.badRequest(res, error.message);
        }
    },

    async addNewTransport(req, res) {
        const params = req.body;
        try {

            const newTransport = Transport.create(params);
            if (newTransport) {
                return responseHandler.ok(res, 'Add new transport successfully!');
            } else {
                return responseHandler.responseWithData(res, 403, {
                    message: "Can't create new transport",
                });
            }
        } catch (error) {
            return responseHandler.badRequest(res, error.message);
        }
    },

    async deleteLocation(req, res) {
        const params = req.body;
        const location_id = params.id;
        try {
            let location = await Location.findAll({
                where: {
                    id: location_id,
                },
            });
            if (!location.length) {
                return responseHandler.notfound(res);
            }
            const destroyLocation = await Location.destroy({
                where: {
                    id: location_id,
                },
            });
            if (destroyLocation) {
                return responseHandler.ok(res, 'Delete location successfully');
            } else {
                return responseHandler.responseWithData(res, 404, { message: "Can't delete location" });
            }
        } catch (error) {
            return responseHandler.error(res);
        }
    },
    async updateLocation(req, res) {
        const params = req.body;
        try {
            const updateLocation = await Location.update(params, {
                where: {
                    id: params.id,
                },
            });
            if (updateLocation) {
                return responseHandler.ok(res, 'Update location successfully');
            } else {
                return responseHandler.responseWithData(res, 403, { message: "Can't update location" });
            }
        } catch (error) {
            return responseHandler.badRequest(res, message.error);
        }
    },
};
