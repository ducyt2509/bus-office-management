const db = require('../models');
const Bus_schedule = db.bus_schedules;
const Bus = db.buses;
const Transport = db.transports;
const Location_Bus_Schedule = db.location_on_bus_schedules;
const QueryTypes = db.Sequelize.QueryTypes;
const responseHandler = require('../handlers/response.handler');

module.exports = {
  async createNewBusSchedule(req, res) {
    const params = req.body;
    try {
      const createBusSchedule = await Bus_schedule.create(params.bus_schedule);
      if (createBusSchedule) {
        for (let i = 0; i < params.location_bus_schedule.length; i++) {
          let data = params.location_bus_schedule[i];
          data.bus_schedule_id = createBusSchedule.dataValues.id;
          await Location_Bus_Schedule.create(data);
        }
        return responseHandler.ok(res, { message: 'Create bus schedule successful!' });
      } else {
        return responseHandler.error(res);
      }
    } catch (error) {
      return responseHandler.badRequest(res, error.message);
    }
  },
  async updateBusSchedule(req, res) {
    const params = req.body;
    try {
      const updateBC = await Bus_schedule.update(params.bus_schedule, {
        where: {
          id: params.bus_schedule.id,
        },
      });
      for (let i = 0; i < params.location_bus_schedule.length; i++) {
        let data = params.location_bus_schedule[i];
        await Location_Bus_Schedule.update(data, {
          where: {
            bus_location_type: params.location_bus_schedule[i].bus_location_type == 1 ? 1 : 0,
            bus_schedule_id: params.bus_schedule.id,
          },
        });
      }
      if (updateBC) {
        return responseHandler.ok(res, 'Update bus schedule successful!');
      } else {
        return responseHandler.responseWithData(res, 403, { message: "Can't update bus schedule" });
      }
    } catch (error) {
      return responseHandler.badRequest(res, error.message);
    }
  },
  async deleteBusSchedule(req, res) {
    const params = req.body;
    try {
      const deleteBusSchedule = await Bus_schedule.destroy({
        where: {
          id: params.id,
        },
      });
      if (deleteBusSchedule) {
        return responseHandler.ok(res, 'Delete bus schedule successful!');
      } else {
        return responseHandler.responseWithData(res, 403, { message: "Can't delete bus schedule" });
      }
    } catch (error) {
      return responseHandler.badRequest(res, error.message);
    }
  },
  async getListBusScheduleForUser(req, res) {
    const params = req.body;
    const limit = !params.limit ? 7 : params.limit;
    const offset = !params.offset ? 0 : params.offset;
    const locationStartId = params.departure_location_id;
    const locationFinishId = params.arrive_location_id;
    const dateStart = params.refresh_date;
    const dateNow = new Date().toJSON().slice(0, 10);
    try {
      const querySQL = `select bs.id, bs.price, bs.time_from, bs.travel_time, 
      bs.refresh_date, bs.effective_date, bs.bus_schedule_status,
      l.location_name as arrive_location, ll.location_name as departure_location,
      c.city_name as city_from, cc.city_name as city_to
      from bus_schedule bs  
      join location l on bs.arrive_location_id = l.id
      join location ll on bs.departure_location_id = ll.id
      join route r on bs.route_id = r.id
      join city c on r.city_from_id = c.id
      join city cc on r.city_to_id = cc.id
      where bs.departure_location_id = ${locationStartId} and bs.arrive_location_id = ${locationFinishId} and '${dateStart}' >= '${dateNow}' and  '${dateStart}' <= bs.refresh_date
      limit ${limit} offset ${offset}`;
      const queryCount = `select count(*) from bus_schedule bs
      where bs.departure_location_id = ${locationStartId} and bs.arrive_location_id = ${locationFinishId} and '${dateStart}' >= '${dateNow}' and  '${dateStart}' <= bs.refresh_date`;
      const [listBusSchedule, numberBusSchedule] = await Promise.all([
        db.sequelize.query(querySQL, { type: QueryTypes.SELECT }),
        db.sequelize.query(queryCount, { type: QueryTypes.SELECT }),
      ]);
      if (listBusSchedule) {
        for (let i = 0; i < listBusSchedule.length; i++) {
          const [
            getListLocationBusSchedule,
            getTransport,
            // getInformationRoute,
            // numberSeatSelected,
          ] = await Promise.all([
            Location_Bus_Schedule.findAll({
              where: {
                bus_schedule_id: listBusSchedule[i].id,
              },
            }),
            Transport.findAll({
              where: {
                bus_schedule_id: listBusSchedule[i].id,
              },
            }),
            // db.sequelize.query(
            //   `select c.city_name as city_from, cc.city_name as city_to from route r
            //   join city c on c.id = r.city_from_id
            //   join city cc on cc.id = r.city_to_id where r.id = ${listBusSchedule[i].route_id}`,
            //   {
            //     type: QueryTypes.SELECT,
            //   }
            // ),
            // db.sequelize.query(
            //   `select t.seat from transaction t
            //     join daily_bus_schedule dbs on dbs.id = t.daily_bus_schedule_id
            //     join bus_schedule bs on dbs.bus_schedule_id = bs.id
            //     where bs.id = ${listBusSchedule[i].id}`,
            //   {
            //     type: QueryTypes.SELECT,
            //   }
            // ),
          ]);
          if (getListLocationBusSchedule) {
            listBusSchedule[i].location_bus_schedule = getListLocationBusSchedule;
          }
          if (getTransport) {
            for (let j = 0; j < getTransport.length; j++) {
              // const getBus = await Bus.findOne({
              //   where: {
              //     id: getTransport[j].bus_id,
              //   },
              // });
              const [getBus, numberSeatSelected] = await Promise.all([
                db.sequelize.query(
                  `select b.* , v.vehicle_name from bus b 
                  join transport t on t.bus_id = b.id
                  join vehicle v on b.vehicle_id = v.id
                    where t.bus_schedule_id = ${listBusSchedule[i].id}`,
                  {
                    type: QueryTypes.SELECT,
                  }
                ),
                db.sequelize.query(
                  `select count(*) from transaction 
                  join t
                    join daily_bus_schedule dbs on dbs.id = t.daily_bus_schedule_id
                    join bus_schedule bs on dbs.bus_schedule_id = bs.id
                    where bs.id = ${listBusSchedule[i].id}`,
                  {
                    type: QueryTypes.SELECT,
                  }
                )
              ])
            
              if (getBus) {
                getTransport[j].dataValues.bus = getBus;
              }
            }
            listBusSchedule[i].transport = getTransport;
          }
          // if (getInformationRoute) {
          //   listBusSchedule[i].route = getInformationRoute;
          // }
          if (numberSeatSelected) {
            listBusSchedule[i].number_seat_selected = numberSeatSelected;
          }
        }
        return responseHandler.responseWithData(res, 200, {
          list_bus_schedule: listBusSchedule,
          number_bus_schedule: numberBusSchedule[0]['count(*)'],
        });
      } else {
        return responseHandler.responseWithData(res, 403, {
          message: "Can't get list bus schedule",
        });
      }
    } catch (error) {
      console.log(error);
      return responseHandler.badRequest(res, error.message);
    }
  },
  async getListBusScheduleForManager(req, res) {
    const params = req.body;
    const offset = !params.offset ? 0 : params.offset;
    const limit = !params.limit ? 5 : params.limit;
    const querySearch = !params.query_search ? '' : params.query_search;
    try {
      // const querySQL = `select * from bus_schedule bs
      // join route r on bs.route_id = r.id
      // join city c on r.city_from_id = c.id
      // join city cc on r.city_to_id = cc.id
      // where (c.city_name like '%${querySearch}%')
      // or (cc.city_name like '%${querySearch}%')
      // limit ${limit} offset ${offset}`;
      const querySQL = `select bs.id ,bs.route_id, departure_location_id , arrive_location_id , price , time_from , travel_time , effective_date , refresh_date , bus_schedule_status , bus_schedule_expire , city_from_id , city_to_id 
from bus_schedule bs
join route r on bs.route_id = r.id 
join city c on r.city_from_id = c.id
 join city cc on r.city_to_id = cc.id
  where (c.city_name like '%${querySearch}%') 
      or (cc.city_name like '%${querySearch}%') 
      limit ${limit} offset ${offset}
`;
      const queryCount = `select count(*) from bus_schedule bs
      join route r on bs.route_id = r.id 
      join city c on r.city_from_id = c.id
      join city cc on r.city_to_id = cc.id
      where (c.city_name like '%${querySearch}%') 
      or (cc.city_name like '%${querySearch}%') `;

      const [listBusSchedule, numberBusSchedule] = await Promise.all([
        db.sequelize.query(querySQL, { type: QueryTypes.SELECT }),
        db.sequelize.query(queryCount, { type: QueryTypes.SELECT }),
      ]);
      if (listBusSchedule) {
        for (let i = 0; i < listBusSchedule.length; i++) {
          const getInformationRoute = await db.sequelize.query(
            `select c.city_name as city_from, cc.city_name as city_to from route r 
            join city c on c.id = r.city_from_id 
            join city cc on cc.id = r.city_to_id where r.id = ${listBusSchedule[i].route_id}`,
            {
              type: QueryTypes.SELECT,
            }
          );
          if (getInformationRoute) {
            listBusSchedule[i].route = getInformationRoute;
          }
        }
        return responseHandler.responseWithData(res, 200, {
          list_bus_schedule: listBusSchedule,
          number_bus_schedule: numberBusSchedule[0]['count(*)'],
        });
      } else {
        return responseHandler.responseWithData(res, 403, {
          message: "Can't get list bus schedule",
        });
      }
    } catch (error) {
      return responseHandler.badRequest(res, error.message);
    }
  },
  async getBusScheduleById(req, res) {
    const params = req.body;
    const id = params.id;
    try {
      const querySQL = `select bs.id ,c.city_name as city_from, bs.route_id, cc.city_name as city_to, 
l.location_name as location_start, ll.location_name as location_finish, bs.price, bs.time_from,  bs.arrive_location_id,
      bs.departure_location_id, bs.travel_time, bs.effective_date, bs.bus_schedule_status, bs.schedule_frequency, bs.bus_schedule_expire , bs.refresh_date
      from bus_schedule bs
      join route r on r.id = bs.route_id 
      join city c on c.id = r.city_from_id
      join city cc on cc.id = r.city_to_id
      join location l on l.id = bs.departure_location_id
      join location ll on ll.id = bs.arrive_location_id 
      where bs.id =${id}
      `;
      const busSchedule = await db.sequelize.query(querySQL, { type: QueryTypes.SELECT });
      console.log('LOG', busSchedule);
      if (busSchedule) {
        const getListLocationBusSchedule = await Location_Bus_Schedule.findAll({
          where: {
            bus_schedule_id: busSchedule[0].id,
          },
        });

        console.log(getListLocationBusSchedule, 'BENA');
        if (getListLocationBusSchedule) {
          busSchedule[0].location_bus_schedule = getListLocationBusSchedule;
        }

        return responseHandler.responseWithData(res, 200, {
          bus_schedule: busSchedule,
        });
      } else {
        return responseHandler.responseWithData(res, 403, {
          message: "Can't get bus schedule",
        });
      }
    } catch (error) {
      console.log(error);
      return responseHandler.badRequest(res, error.message);
    }
  },
};
