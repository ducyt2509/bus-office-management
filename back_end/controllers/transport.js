const db = require('../models');
const Transport = db.transports;
const Op = db.Sequelize.Op;
const QueryTypes = db.Sequelize.QueryTypes;

const responseHandler = require('../handlers/response.handler');
const validateHandler = require('../handlers/validate.handler');
const messageHandler = require('../handlers/message.handler');
const regexHandler = require('../handlers/regex.handler');

const checkExistTransport = async (bus_schedule_id, bus_id, departure_date) => {
  const getTransport = await Transport.findOne({
    where: {
      [Op.and]: [
        {
          bus_schedule_id,
        },
        {
          bus_id,
        },
        {
          departure_date,
        },
      ],
    },
  });
  if (getTransport) return true;
  return false;
};

module.exports = {
  async getListTransport(req, res) {
    try {
      var { limit, offset, query_search } = req.body;
      limit = limit ? limit : 7;
      offset = offset ? offset : 0;
      const querySearch = !query_search ? '' : query_search.toString().trim();

      if (
        !validateHandler.validatePositiveIntegerNumber(parseInt(limit)) ||
        !validateHandler.validatePositiveIntegerNumber(parseInt(offset))
      )
        return responseHandler.badRequest(res, messageHandler.messageValidateFailed);

      const querySQL = `SELECT t.id  , t.bus_id, t.bus_schedule_id ,vehicle_plate , bs.route_id , bs.time_from , bs.travel_time, t.departure_date , r.city_from_id , r.city_to_id , c.city_name as 'departure_city' , cc.city_name as 'arrive_city' FROM bom.transport t 
            join bus_schedule bs on bs.id = t.bus_schedule_id
            join  bus b on b.id = t.bus_id
            join route r  on bs.route_id = r.id
            join city c on r.city_from_id = c.id
            join city cc on r.city_to_id = cc.id
			where (vehicle_plate like '%${querySearch}%')
			or ( t.departure_date like '%${querySearch}%')
            or  (c.city_name like '%${querySearch}%' )
            or ( cc.city_name like '%${querySearch}%' )
            order  by id desc
            limit ${limit} offset ${offset}
        ;`;

      const queryCount = `SELECT count(*) FROM bom.transport`;
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
    try {
      const { bus_schedule_id, bus_id, departure_date } = req.body;
      if (
        !validateHandler.validatePositiveIntegerNumber(parseInt(bus_schedule_id)) ||
        !validateHandler.validatePositiveIntegerNumber(parseInt(bus_id)) ||
        !validateHandler.validateDate(departure_date)
      )
        return responseHandler.badRequest(res, messageHandler.messageValidateFailed);
      const isExist = await checkExistTransport(bus_schedule_id, bus_id, departure_date);
      if (isExist) return responseHandler.badRequest(res, 'Transport is already exist');
      const newTransport = Transport.create({
        bus_schedule_id,
        bus_id,
        departure_date,
      });
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

  async deleteTransport(req, res) {
    try {
      const { id } = req.body;
      if (!validateHandler.validatePositiveIntegerNumber(parseInt(id)))
        return responseHandler.badRequest(res, messageHandler.messageValidateFailed);

      const deleteTransport = await Transport.destroy({
        where: {
          id,
        },
      });
      if (deleteTransport) {
        return responseHandler.ok(res, 'Delete transport successfully');
      } else {
        return responseHandler.badRequest(res, 'Transport not found');
      }
    } catch (error) {
      return responseHandler.error(res);
    }
  },
  async updateTransport(req, res) {
    try {
      const { id, bus_schedule_id, bus_id, departure_date } = req.body;

      if (
        !validateHandler.validatePositiveIntegerNumber(parseInt(id)) ||
        !validateHandler.validatePositiveIntegerNumber(parseInt(bus_schedule_id)) ||
        !validateHandler.validatePositiveIntegerNumber(parseInt(bus_id)) ||
        !validateHandler.validateDate(departure_date)
      )
        return responseHandler.badRequest(res, messageHandler.messageValidateFailed);
      const isExist = await checkExistTransport(bus_schedule_id, bus_id, departure_date);

      if (isExist) return responseHandler.badRequest(res, 'Transport is already exist');
      const updateTransport = await Transport.update(
        {
          bus_schedule_id,
          bus_id,
          departure_date,
        },
        { where: { id } }
      );
      if (updateTransport) {
        return responseHandler.ok(res, 'Update transport successfully!');
      } else {
        return responseHandler.responseWithData(res, 403, {
          message: 'Transport not found',
        });
      }
    } catch (error) {
      return responseHandler.badRequest(res, error.message);
    }
  },
  async getTransportById(req, res) {
    const params = req.body;
    try {
      const querySQL = `select t.*, bs.schedule_frequency from transport t join bus_schedule bs on t.bus_schedule_id = bs.id where t.id = ${params.id}`;

      const transport = await db.sequelize.query(querySQL, { type: QueryTypes.SELECT });

      if (transport) {
        return responseHandler.responseWithData(res, 200, transport[0]);
      } else {
        return responseHandler.badRequest(res, 'Transport not found');
      }
    } catch (err) {
      return responseHandler.badRequest(res, err.message);
    }
  },
};
