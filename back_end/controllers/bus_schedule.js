const db = require('../models');
const Bus_schedule = db.bus_schedules;
const Bus = db.buses;
const Transport = db.transports;
const Location_Bus_Schedule = db.location_on_bus_schedules;
const QueryTypes = db.Sequelize.QueryTypes;
const responseHandler = require('../handlers/response.handler');
const validateHandler = require('../handlers/validate.handler');
const messageHandler = require('../handlers/message.handler');
const regexHandler = require('../handlers/regex.handler');
const { Op } = require('sequelize');

Date.prototype.addDays = function (days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

var DateDiff = {
  inDays: function (d1, d2) {
    var t2 = d2.getTime();
    var t1 = d1.getTime();

    return Math.floor((t2 - t1) / (24 * 3600 * 1000));
  },

  inWeeks: function (d1, d2) {
    var t2 = d2.getTime();
    var t1 = d1.getTime();

    return parseInt((t2 - t1) / (24 * 3600 * 1000 * 7));
  },

  inMonths: function (d1, d2) {
    var d1Y = d1.getFullYear();
    var d2Y = d2.getFullYear();
    var d1M = d1.getMonth();
    var d2M = d2.getMonth();

    return d2M + 12 * d2Y - (d1M + 12 * d1Y);
  },

  inYears: function (d1, d2) {
    return d2.getFullYear() - d1.getFullYear();
  },
};

const checkRenewal = (date, timeExpire) => {
  const current = new Date();
  const expireDate = new Date(date);
  const renewalDate = expireDate.getTime() - (timeExpire / 2) * 24 * 60 * 60 * 1000;
  if (current.getTime() >= renewalDate) {
    return true;
  }
  return false;
};

const removeDuplicates = (arr) => {
  return arr.filter(
    (obj, index, self) =>
      index ===
      self.findIndex(
        (o) => JSON.stringify(o) === JSON.stringify(obj) // compare all attributes of objects
      )
  );
};
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
        return responseHandler.ok(res, { message: 'Tạo lịch trình thành công!' });
      } else {
        return responseHandler.error(res);
      }
    } catch (error) {
      return responseHandler.badRequest(res, 'Có lỗi xảy ra khi thao tác. Vui lòng thử lại');
    }
  },
  async updateBusSchedule(req, res) {
    const params = req.body;
    const id = params.id;
    const {
      route_id,
      price,
      time_from,
      arrive_location_id,
      departure_location_id,
      travel_time,
      effective_date,
      bus_schedule_status,
      schedule_frequency,
      bus_schedule_expire,
      refresh_date,
    } = params.bus_schedule;
    try {
      const updateBC = await Bus_schedule.update(
        {
          route_id,
          price,
          time_from,
          arrive_location_id,
          departure_location_id,
          travel_time,
          effective_date,
          bus_schedule_status,
          schedule_frequency,
          bus_schedule_expire,
          refresh_date,
        },
        {
          where: {
            id,
          },
        }
      );
      if (params.location_bus_schedule) {
        for (let i = 0; i < params.location_bus_schedule.length; i++) {
          let data = params.location_bus_schedule[i];
          let checkLocationOnBus = await Location_Bus_Schedule.findOne({
            where: {
              id,
            },
          });
          if (checkLocationOnBus) {
            await Location_Bus_Schedule.update(data, {
              where: {
                bus_location_type: params.location_bus_schedule[i].bus_location_type == 1 ? 1 : 0,
                bus_schedule_id: params.id,
              },
            });
          }
          {
            await Location_Bus_Schedule.create({
              bus_location_type: params.location_bus_schedule[i].bus_location_type == 1 ? 1 : 0,
              bus_schedule_id: params.id,
            });
          }
        }
      }
      if (updateBC) {
        return responseHandler.ok(res, 'Cập nhật hành trình thành công!');
      } else {
        return responseHandler.responseWithData(res, 403, {
          message: 'Không thể cập nhật hành trình',
        });
      }
    } catch (error) {
      return responseHandler.badRequest(res, 'Có lỗi xảy ra khi thao tác. Vui lòng thử lại');
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
        return responseHandler.ok(res, 'Xoá lịch trình thành công!');
      } else {
        return responseHandler.responseWithData(res, 403, {
          message: 'Không thể xoá hành trình',
        });
      }
    } catch (error) {
      return responseHandler.badRequest(res, 'Có lỗi xảy ra khi thao tác. Vui lòng thử lại');
    }
  },
  async getListBusScheduleForUser(req, res) {
    const params = req.body;
    const limit = !params.limit || !params.limit <= 0 ? 7 : params.limit;
    const offset = !params.offset || !params.offset <= 0 ? 0 : params.offset;
    const locationStartId = params.departure_location_id;
    const locationFinishId = params.arrive_location_id;
    const dateStart = params.refresh_date;
    const dateNow = new Date().toJSON().slice(0, 10);
    try {
      let querySQL = `select bs.*, ll.location_name as departure_location,
      c.city_name as city_from, cc.city_name as city_to
      from bus_schedule bs  
      join location l on bs.arrive_location_id = l.id
      join location ll on bs.departure_location_id = ll.id
      join route r on bs.route_id = r.id
      join city c on r.city_from_id = c.id
      join city cc on r.city_to_id = cc.id
      where r.city_from_id = ${locationStartId} and r.city_to_id = ${locationFinishId} 
      `;

      let queryCount = `select count(*) from bus_schedule bs
      join route r on bs.route_id = r.id
      where r.city_from_id = ${locationStartId} and r.city_to_id = ${locationFinishId} and '${dateStart}' >= '${dateNow}' and  '${dateStart}' <= bs.refresh_date`;
      if (!params.role_id) {
        querySQL += ` and '${dateStart}' >= '${dateNow}'`;
      }
      const [listBusSchedule, numberBusSchedule] = await Promise.all([
        db.sequelize.query(querySQL, { type: QueryTypes.SELECT }),
        db.sequelize.query(queryCount, { type: QueryTypes.SELECT }),
      ]);

      if (listBusSchedule) {
        for (let i = 0; i < listBusSchedule.length; i++) {
          let condition = {
            departure_date: {
              [Op.lte]: new Date(dateStart),
            },
            bus_schedule_id: listBusSchedule[i].id,
          };
          if (params.role_id == 1 || params.role_id == 2) {
            delete condition.departure_date;
          }
          const [getListLocationBusSchedule, getTransport] = await Promise.all([
            Location_Bus_Schedule.findAll({
              where: {
                bus_schedule_id: listBusSchedule[i].id,
              },
            }),
            Transport.findAll({
              where: condition,
            }),
          ]);
          if (getListLocationBusSchedule) {
            listBusSchedule[i].location_bus_schedule = getListLocationBusSchedule;
          }
          if (getTransport) {
            for (let j = 0; j < getTransport.length; j++) {
              const [getBus, numberSeatSelected, numberSeatSold] = await Promise.all([
                db.sequelize.query(
                  ` select b.* , v.vehicle_type_name, v.number_seat, u.user_name as main_driver, uu.user_name as support_driver from transport t  
									join bus b  on t.bus_id = b.id
									join vehicle_type v on b.vehicle_type_id = v.id
									join user u on u.id = b.main_driver_id
									join user uu on uu.id = b.support_driver_id
									where t.bus_schedule_id = ${getTransport[j].bus_schedule_id} and t.bus_id = ${getTransport[j].bus_id}`,
                  {
                    type: QueryTypes.SELECT,
                  }
                ),
                db.sequelize.query(
                  `select t.seat, t.passenger_name, t.passenger_phone, t.id, t.pickup_location, t.drop_off_location, t.payment_status, t.date_detail, t.ticket_price from transaction t
									join transport tr on tr.id = t.transport_id
									where tr.bus_schedule_id = ${getTransport[j].bus_schedule_id} and tr.bus_id = ${
                    getTransport[j].bus_id
                  } and t.payment_status != 3 and t.date_detail like"%${
                    new Date(dateStart).toISOString().split('T')[0]
                  }%"`,
                  {
                    type: QueryTypes.SELECT,
                  }
                ),
                db.sequelize.query(
                  `select count(*) from transaction t
									join transport tr on tr.id = t.transport_id
									where tr.bus_schedule_id = ${getTransport[j].bus_schedule_id} and tr.bus_id = ${
                    getTransport[j].bus_id
                  } and t.payment_status = 1 and t.date_detail like"${
                    new Date(dateStart).toISOString().split('T')[0]
                  }"`,
                  {
                    type: QueryTypes.SELECT,
                  }
                ),
              ]);
              if (getBus) {
                getTransport[j].dataValues.bus = getBus;
              }
              if (numberSeatSelected) {
                getTransport[j].dataValues.number_seat_selected = numberSeatSelected.filter((e) => {
                  return (
                    e.date_detail.split(' ')[0] == new Date(dateStart).toISOString().split('T')[0]
                  );
                });
              }
              if (numberSeatSold) {
                getTransport[j].dataValues.number_seat_sold = numberSeatSold[0]['count(*)'];
              }
            }
            listBusSchedule[i].transport = getTransport;
          }
        }
        let booking_date = new Date(dateStart);

        let filter = listBusSchedule.filter((bs) => {
          return (
            new Date(bs.refresh_date) >= booking_date &&
            booking_date >= new Date(bs.effective_date) &&
            DateDiff.inDays(booking_date, new Date(bs.effective_date)) % bs.schedule_frequency == 0
          );
        });
        return responseHandler.responseWithData(res, 200, {
          list_bus_schedule: filter,
          number_bus_schedule: numberBusSchedule[0]['count(*)'],
        });
      } else {
        return responseHandler.responseWithData(res, 403, {
          message: 'không thể lấy danh sách lịch trình',
        });
      }
    } catch (error) {
      return responseHandler.badRequest(res, 'Có lỗi xảy ra khi thao tác. Vui lòng thử lại');
    }
  },

  async getListBusScheduleForManager(req, res) {
    const params = req.body;
    const offset = !params.offset || params.offset <= 0 ? 0 : params.offset;
    const limit = !params.limit ? 5 : params.limit;
    const querySearch = !params.query_search ? '' : params.query_search;

    try {
      const querySQL = `select bs.id ,bs.route_id, departure_location_id , arrive_location_id , price , time_from , travel_time , effective_date , refresh_date , bus_schedule_status , bus_schedule_expire , city_from_id , city_to_id 
			from bus_schedule bs
			join route r on bs.route_id = r.id 
			join city c on r.city_from_id = c.id
			join city cc on r.city_to_id = cc.id
      where ( (c.city_name like '%%') 
      or (cc.city_name like '%%') )
			
      order by id
      limit ${limit} offset ${offset}
`;
      // and refresh_date >= "${currentDate}"
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
          message: 'Không thể lấy danh sách lịch trình',
        });
      }
    } catch (error) {
      return responseHandler.badRequest(res, 'Có lỗi xảy ra khi thao tác. Vui lòng thử lại');
    }
  },
  async getListBusScheduleForDriver(req, res) {
    const params = req.body;
    const departure_date = params.departure_date;
    const user_id = params.user_id;
    try {
      const querySQL = `select bs.time_from, c.city_name as city_from, cc.city_name as city_to,
			 v.number_seat, tr.id as transport_id, tr.departure_date, bs.effective_date, bs.schedule_frequency
			 from bus_schedule bs 
      join transport tr on bs.id = tr.bus_schedule_id
      join bus b on b.id = tr.bus_id
      join vehicle_type v on v.id = b.vehicle_type_id 
      join user u on u.id = b.main_driver_id
      join route r on r.id = bs.route_id
      join city c on c.id = r.city_from_id
      join city cc on cc.id = r.city_to_id
      left join user uu on uu.id = b.support_driver_id
      where (b.main_driver_id = ${user_id} or b.support_driver_id = ${user_id}) 
	    and bs.effective_date < "${departure_date}" < bs.refresh_date 
	    `;

      const queryCount = `select count(*) from bus_schedule bs 
      join transport tr on bs.id = tr.bus_schedule_id
      join bus b on b.id = tr.bus_id
      join user u on u.id = b.main_driver_id
      left join user uu on uu.id = b.support_driver_id
      where (b.main_driver_id = ${user_id} or b.support_driver_id = ${user_id})
	  	and bs.effective_date < "${departure_date}" < bs.refresh_date 
	    `;

      const [listBusSchedule, numberBusSchedule] = await Promise.all([
        db.sequelize.query(querySQL, { type: QueryTypes.SELECT }),
        db.sequelize.query(queryCount, { type: QueryTypes.SELECT }),
      ]);
      if (listBusSchedule) {
        for (let i = 0; i < listBusSchedule.length; i++) {
          const numberSeatSQL = `select seat from transaction t 
          			join transport ts on t.transport_id = ts.id where ts.id = ${listBusSchedule[i].transport_id} and t.date_detail like "%${departure_date}%" and t.payment_status != 3`;
          let count = await db.sequelize.query(numberSeatSQL, { type: QueryTypes.SELECT });
          if (count) {
            listBusSchedule[i].number_seat_sold = count
              .map((e) => e.seat)
              .join(', ')
              .split(', ').length;
          }
        }
        const filterListBusSchedule = listBusSchedule.filter((e) => {
          return (
            DateDiff.inDays(new Date(departure_date), new Date(e.effective_date)) %
              e.schedule_frequency ==
            0
          );
        });
        return responseHandler.responseWithData(res, 200, {
          list_bus_schedule: filterListBusSchedule,
          number_bus_schedule: numberBusSchedule[0]['count(*)'],
        });
      } else {
        return responseHandler.responseWithData(res, 403, {
          message: 'Không thể lấy danh sách lịch trình',
        });
      }
    } catch (error) {
      return responseHandler.badRequest(res, 'Có lỗi xảy ra khi thao tác. Vui lòng thử lại');
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
      if (busSchedule) {
        const getListLocationBusSchedule = await Location_Bus_Schedule.findAll({
          where: {
            bus_schedule_id: busSchedule[0].id,
          },
        });

        if (getListLocationBusSchedule) {
          busSchedule[0].location_bus_schedule = getListLocationBusSchedule;
        }

        return responseHandler.responseWithData(res, 200, {
          bus_schedule: busSchedule,
        });
      } else {
        return responseHandler.responseWithData(res, 403, {
          message: 'Không thể lấy thông tin lịch trình',
        });
      }
    } catch (error) {
      return responseHandler.badRequest(res, 'Có lỗi xảy ra khi thao tác. Vui lòng thử lại');
    }
  },

  async checkRenewalBusSchedule(req, res) {
    try {
      const currentDate = validateHandler.validateDate(new Date().toDateString());
      const queryGetBusScheduleList = `select * from bus_schedule where refresh_date >=  ${currentDate} and bus_schedule_status = 1  `;
      const busScheduleList = await db.sequelize.query(queryGetBusScheduleList, {
        type: QueryTypes.SELECT,
      });
      let renewalList = [];

      for (let index = 0; index < busScheduleList.length; index++) {
        // if in the database there are several objects with the same properties and data but it is renewed before
        const formatDate = validateHandler.validateDate(
          `'${busScheduleList[index].effective_date}'`
        );
        const query = `SELECT * FROM bus_schedule
							WHERE route_id = ${busScheduleList[index].route_id} and departure_location_id = ${busScheduleList[index].departure_location_id} and arrive_location_id = ${busScheduleList[index].arrive_location_id}  
							and price = ${busScheduleList[index].price} and time_from = ${busScheduleList[index].time_from} and  travel_time = ${busScheduleList[index].travel_time}
							and schedule_frequency = ${busScheduleList[index].schedule_frequency} and bus_schedule_expire = ${busScheduleList[index].bus_schedule_expire}
							and effective_date = '${formatDate}'
							order by refresh_date desc limit 1 `;
        const getBs = await db.sequelize.query(query, { type: QueryTypes.SELECT });

        let renewalDate = getBs[0].refresh_date;
        let timeExpire = getBs[0].bus_schedule_expire;
        let isRenewal = checkRenewal(renewalDate, timeExpire);
        if (isRenewal) {
          renewalList.push(getBs[0]);
        }
      }
      renewalList = removeDuplicates(renewalList);

      return responseHandler.responseWithData(res, 200, {
        totalBSNeedRenewal: renewalList.length,
      });
    } catch (error) {
      responseHandler.badRequest(res, 'Có lỗi xảy ra khi thao tác. Vui lòng thử lại');
    }
  },
  async checkRenewalBusSchedule(req, res) {
    try {
      const currentDate = validateHandler.validateDate(new Date().toDateString());
      const queryGetBusScheduleList = `select * from bus_schedule where refresh_date >=  "${currentDate}" and bus_schedule_status = 1  `;
      const busScheduleList = await db.sequelize.query(queryGetBusScheduleList, {
        type: QueryTypes.SELECT,
      });
      let renewalList = [];

      for (let index = 0; index < busScheduleList.length; index++) {
        // if in the database there are several objects with the same properties and data but it is renewed before
        const formatDate = validateHandler.validateDate(
          `'${busScheduleList[index].effective_date}'`
        );
        const query = `SELECT * FROM bus_schedule
							WHERE route_id = ${busScheduleList[index].route_id} and departure_location_id = ${busScheduleList[index].departure_location_id} and arrive_location_id = ${busScheduleList[index].arrive_location_id}  
						  and time_from = ${busScheduleList[index].time_from} and travel_time = ${busScheduleList[index].travel_time}
							and schedule_frequency = ${busScheduleList[index].schedule_frequency}
							order by refresh_date desc limit 1 `;
        const getBs = await db.sequelize.query(query, { type: QueryTypes.SELECT });

        let renewalDate = getBs[0].refresh_date;
        let timeExpire = getBs[0].bus_schedule_expire;
        let isRenewal = checkRenewal(renewalDate, timeExpire);
        if (isRenewal) {
          renewalList.push(getBs[0]);
        }
      }
      renewalList = removeDuplicates(renewalList);
      return responseHandler.responseWithData(res, 200, {
        totalBSNeedRenewal: renewalList.length,
      });
    } catch (error) {
      responseHandler.badRequest(res, 'Có lỗi xảy ra khi thao tác. Vui lòng thử lại');
    }
  },
};
