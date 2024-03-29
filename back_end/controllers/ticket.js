const db = require('../models');
const Ticket = db.tickets;
const Op = db.Sequelize.Op;
const QueryTypes = db.Sequelize.QueryTypes;
const responseHandler = require('../handlers/response.handler');

Date.prototype.addDays = function (days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};
async function addReport(arr, sql) {
  let query = await db.sequelize.query(sql, { type: QueryTypes.SELECT });
  arr.push(query);
}
module.exports = {
  async createNewTicket(req, res) {
    const params = req.body;
    try {
      let addTicket = await Ticket.create(params);
      if (addTicket) {
        return responseHandler.ok(res, 'Tạo vé thành công');
      } else {
        return responseHandler.badRequest(res, 'Tạo vé thất bại');
      }
    } catch (err) {
      return responseHandler.badRequest(res, 'Có lỗi xảy ra trong quá trình thao tác');
    }
  },
  async getRevenueListByRoute(req, res) {
    const params = req.body;
    const querySearch = params.query_search ? params.query_search : 2;
    const limit = !params.limit || !params.limit <= 0 ? 7 : params.limit;
    const offset = !params.offset || !params.offset <= 0 ? 0 : params.offset;

    try {
      let querySQL = `select c.city_name as city_from, cc.city_name as city_to, tra.seat, tra.ticket_price, r.id from ticket t 
			join transaction tra on t.transaction_id = tra.id
			join transport trans on trans.id = tra.transport_id
			join bus_schedule bs on bs.id = trans.bus_schedule_id
			join route r on r.id = bs.route_id
			join city c on c.id = r.city_from_id
			join city cc on cc.id = r.city_to_id `;

      let queryCount = `select count(*) from ticket t 
			join transaction tra on t.transaction_id = tra.id
			join transport trans on trans.id = tra.transport_id
			join bus_schedule bs on bs.id = trans.bus_schedule_id
			join route r on r.id = bs.route_id
			join city c on c.id = r.city_from_id
			join city cc on cc.id = r.city_to_id `;
      if (querySearch == 1) {
        return responseHandler.responseWithData(res, 200, {
          list_revenue_route: [],
          number_revenue_route: 0,
        });
      }
      if (querySearch == 2) {
        let day = new Date().getDay();
        let e;
        if (day == 0) {
          e = 6;
        } else {
          e = day - 1;
        }
        let firstDay = new Date().addDays(-e);
        let condition = ` where tra.date_detail > "${
          new Date(firstDay).toISOString().split('T')[0]
        }" and tra.date_detail < "${new Date(firstDay.addDays(7)).toISOString().split('T')[0]}"`;

        let cloneListRevenueSQL = querySQL + `${condition}`;
        let cloneQueryCount = queryCount + condition;
        const [listRevenue, numberRevenue] = await Promise.all([
          db.sequelize.query(cloneListRevenueSQL, { type: QueryTypes.SELECT }),
          db.sequelize.query(cloneQueryCount, { type: QueryTypes.SELECT }),
        ]);

        if (listRevenue) {
          let revenueId = [];
          listRevenue.forEach((element) => {
            if (!revenueId.includes(element.id)) {
              revenueId.push(element.id);
            }
          });
          let revenue = [];
          revenueId.forEach((e) => {
            let d = listRevenue.filter((d) => d.id == e);
            let ticket = d
              .map((e) => {
                if (!e.seat) {
                  return 0;
                } else {
                  return e.seat.split(', ').length;
                }
              })
              .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
            let price = d
              .map((e) => {
                if (!e.ticket_price) {
                  return 0;
                } else {
                  return e.ticket_price;
                }
              })
              .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
            revenue.push({
              route_name: d[0]?.city_from + ' - ' + d[0]?.city_to,
              price: price,
              ticket: ticket,
            });
          });
          return responseHandler.responseWithData(res, 200, {
            list_revenue_route: revenue,
            number_revenue_route: numberRevenue[0]['count(*)'],
          });
        } else {
          return responseHandler.badRequest(res, 'Không thể lấy danh sách doanh thu theo chuyến');
        }
      }
      if (querySearch == 3) {
        let month = new Date().getMonth() + 1;
        let year = new Date().getFullYear();
        let firstDay = new Date(`${year}-${month}-01 07:00:00`);
        let condition = ` where tra.date_detail >= "${
          new Date(firstDay).toISOString().split('T')[0]
        }" and tra.date_detail <= "${new Date(firstDay.addDays(29)).toISOString().split('T')[0]}"`;

        let cloneListRevenueSQL = querySQL + `${condition}`;
        let cloneQueryCount = queryCount + condition;
        const [listRevenue, numberRevenue] = await Promise.all([
          db.sequelize.query(cloneListRevenueSQL, { type: QueryTypes.SELECT }),
          db.sequelize.query(cloneQueryCount, { type: QueryTypes.SELECT }),
        ]);
        if (listRevenue) {
          let revenueId = [];
          listRevenue.forEach((element) => {
            if (!revenueId.includes(element.id)) {
              revenueId.push(element.id);
            }
          });
          let revenue = [];
          revenueId.forEach((e) => {
            let d = listRevenue.filter((d) => d.id == e);
            let ticket = d
              .map((e) => {
                if (!e.seat) {
                  return 0;
                } else {
                  return e.seat.split(', ').length;
                }
              })
              .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
            let price = d
              .map((e) => {
                if (!e.ticket_price) {
                  return 0;
                } else {
                  return e.ticket_price;
                }
              })
              .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
            revenue.push({
              route_name: d[0]?.city_from + ' - ' + d[0]?.city_to,
              price: price,
              ticket: ticket,
            });
          });
          return responseHandler.responseWithData(res, 200, {
            list_revenue_route: revenue,
            number_revenue_route: numberRevenue[0]['count(*)'],
          });
        } else {
          return responseHandler.badRequest(res, 'Không thể lấy danh sách doanh thu theo chuyến');
        }
      }
      if (querySearch == 4) {
        let month = 1;
        let year = new Date().getFullYear();
        let firstDay = new Date(`${year}-${month}-01 07:00:00`);
        let condition = ` where tra.date_detail > "${
          new Date(firstDay).toISOString().split('T')[0]
        }" and tra.date_detail < "${
          new Date(`${year}-12-31 07:00:00`).toISOString().split('T')[0]
        }"`;

        let cloneListRevenueSQL = querySQL + `${condition}`;
        let cloneQueryCount = queryCount + condition;
        const [listRevenue, numberRevenue] = await Promise.all([
          db.sequelize.query(cloneListRevenueSQL, { type: QueryTypes.SELECT }),
          db.sequelize.query(cloneQueryCount, { type: QueryTypes.SELECT }),
        ]);
        if (listRevenue) {
          let revenueId = [];
          listRevenue.forEach((element) => {
            if (!revenueId.includes(element.id)) {
              revenueId.push(element.id);
            }
          });
          let revenue = [];
          revenueId.forEach((e) => {
            let d = listRevenue.filter((d) => d.id == e);
            let ticket = d
              .map((e) => {
                if (!e.seat) {
                  return 0;
                } else {
                  return e.seat.split(', ').length;
                }
              })
              .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
            let price = d
              .map((e) => {
                if (!e.ticket_price) {
                  return 0;
                } else {
                  return e.ticket_price;
                }
              })
              .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
            revenue.push({
              route_name: d[0]?.city_from + ' - ' + d[0]?.city_to,
              price: price,
              ticket: ticket,
            });
          });
          return responseHandler.responseWithData(res, 200, {
            list_revenue_route: revenue,
            number_revenue_route: numberRevenue[0]['count(*)'],
          });
        } else {
          return responseHandler.badRequest(res, 'Không thể lấy danh sách doanh thu theo chuyến');
        }
      }
    } catch (error) {
      console.log(error);
      return responseHandler.badRequest(res, 'Có lỗi xảy ra trong quá trình thao tác');
    }
  },
  async getRevenueList(req, res) {
    const params = req.body;
    const limit = !params.limit || !params.limit <= 0 ? 7 : params.limit;
    const offset = !params.offset || !params.offset <= 0 ? 0 : params.offset;
    const querySearch = params.query_search ? params.query_search : 1;
    try {
      let listRevenueSQL = `
            select tr.ticket_price, o.office_name, u.user_name, u.phone, u.role_id, tr.seat from ticket tic 
            join transaction tr on tr.id = tic.transaction_id
            left join user u on u.id = tr.cashier
            left join office o on o.id = u.office_id
            `;
      let queryCount = `select count(*) from ticket tic join transaction tr on tr.id = tic.transaction_id`;

      let totalRevenueSQL = `select sum(tr.ticket_price) from ticket tic 
            	join transaction tr on tr.id = tic.transaction_id`;

      let ticketSQL = `select tr.seat from ticket tic 
            	join transaction tr on tr.id = tic.transaction_id`;

      if (querySearch == 1) {
        let whereCondition = ` where tr.date_detail like "%${
          new Date().toISOString().split('T')[0]
        }%"`;
        listRevenueSQL += `${whereCondition} limit ${limit} offset ${offset}`;
        queryCount += whereCondition;

        totalRevenueSQL += whereCondition;

        ticketSQL += whereCondition;

        const [listRevenue, numberRevenue, totalRevenue, ticket] = await Promise.all([
          db.sequelize.query(listRevenueSQL, { type: QueryTypes.SELECT }),
          db.sequelize.query(queryCount, { type: QueryTypes.SELECT }),
          db.sequelize.query(totalRevenueSQL, { type: QueryTypes.SELECT }),
          db.sequelize.query(ticketSQL, { type: QueryTypes.SELECT }),
        ]);
        let countTicket = ticket
          .map((e) => {
            if (!e.seat) {
              return 0;
            } else {
              return e.seat.split(', ').length;
            }
          })
          .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        if (listRevenue) {
          return responseHandler.responseWithData(res, 200, {
            list_revenue: listRevenue,
            number_revenue: numberRevenue[0]['count(*)'],
            count_ticket: countTicket,
            total_revenue: totalRevenue[0]['sum(tr.ticket_price)'],
            revenue_report: [],
          });
        } else {
          return responseHandler.badRequest(res, 'Không thể lấy danh sách thống kê');
        }
      }
      if (querySearch == 2) {
        let promiseQuery = [];
        let day = new Date().getDay();
        let e;
        if (day == 0) {
          e = 6;
        } else {
          e = day - 1;
        }
        let firstDay = new Date().addDays(-e);
        let condition = ` where tr.date_detail > "${
          new Date(firstDay).toISOString().split('T')[0]
        }" and tr.date_detail < "${new Date(firstDay.addDays(7)).toISOString().split('T')[0]}"`;

        let cloneListRevenueSQL = listRevenueSQL + `${condition} limit ${limit} offset ${offset}`;
        let cloneQueryCount = queryCount + condition;

        const report_revenue = [];

        for (let i = 0; i < 7; i++) {
          let whereCondition = ` where tr.date_detail like "%${
            new Date(firstDay).addDays(i).toISOString().split('T')[0]
          }%"`;
          let sql = listRevenueSQL + whereCondition;
          promiseQuery.push(addReport(report_revenue, sql));
        }
        await Promise.all(promiseQuery);
        const [listRevenue, numberRevenue] = await Promise.all([
          db.sequelize.query(cloneListRevenueSQL, { type: QueryTypes.SELECT }),
          db.sequelize.query(cloneQueryCount, { type: QueryTypes.SELECT }),
        ]);

        let ticket = report_revenue
          .map((i) => {
            return i
              .map((e) => {
                if (!e.seat) {
                  return 0;
                } else {
                  return e.seat.split(', ').length;
                }
              })
              .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
          })
          .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

        let totalRevenue = report_revenue
          .map((i) => {
            return i
              .map((e) => {
                if (!e.ticket_price) {
                  return 0;
                } else {
                  return e.ticket_price;
                }
              })
              .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
          })
          .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

        let barData = report_revenue.map((i) => {
          return i
            .map((e) => {
              if (!e.ticket_price) {
                return 0;
              } else {
                return e.ticket_price;
              }
            })
            .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        });

        if (listRevenue) {
          return responseHandler.responseWithData(res, 200, {
            list_revenue: listRevenue,
            number_revenue: numberRevenue[0]['count(*)'],
            count_ticket: ticket,
            total_revenue: totalRevenue,
            revenue_report: barData,
          });
        } else {
          return responseHandler.badRequest(res, 'Không thể lấy danh sách thống kê');
        }
      }
      if (querySearch == 3) {
        let promiseQuery = [];
        let month = new Date().getMonth() + 1;
        let year = new Date().getFullYear();
        let firstDay = new Date(`${year}-${month}-01 07:00:00`);
        let condition = ` where tr.date_detail >= "${
          new Date(firstDay).toISOString().split('T')[0]
        }" and tr.date_detail <= "${new Date(firstDay.addDays(29)).toISOString().split('T')[0]}"`;

        let cloneListRevenueSQL = listRevenueSQL + `${condition} limit ${limit} offset ${offset}`;
        let cloneQueryCount = queryCount + condition;

        const report_revenue = [];

        for (let i = 0; i < 30; i++) {
          let whereCondition = ` where tr.date_detail like "%${
            new Date(firstDay).addDays(i).toISOString().split('T')[0]
          }%"`;
          let sql = listRevenueSQL + whereCondition;
          promiseQuery.push(addReport(report_revenue, sql));
        }
        await Promise.all(promiseQuery);
        const [listRevenue, numberRevenue] = await Promise.all([
          db.sequelize.query(cloneListRevenueSQL, { type: QueryTypes.SELECT }),
          db.sequelize.query(cloneQueryCount, { type: QueryTypes.SELECT }),
        ]);

        let ticket = report_revenue
          .map((i) => {
            return i
              .map((e) => {
                if (!e.seat) {
                  return 0;
                } else {
                  return e.seat.split(', ').length;
                }
              })
              .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
          })
          .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

        let totalRevenue = report_revenue
          .map((i) => {
            return i
              .map((e) => {
                if (!e.ticket_price) {
                  return 0;
                } else {
                  return e.ticket_price;
                }
              })
              .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
          })
          .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

        let barData = report_revenue.map((i) => {
          return i
            .map((e) => {
              if (!e.ticket_price) {
                return 0;
              } else {
                return e.ticket_price;
              }
            })
            .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        });

        if (listRevenue) {
          return responseHandler.responseWithData(res, 200, {
            list_revenue: listRevenue,
            number_revenue: numberRevenue[0]['count(*)'],
            count_ticket: ticket,
            total_revenue: totalRevenue,
            revenue_report: barData,
          });
        } else {
          return responseHandler.badRequest(res, 'Không thể lấy danh sách thống kê');
        }
      }
      if (querySearch == 4) {
        let promiseQuery = [];
        let month = 1;
        let year = new Date().getFullYear();
        let firstDay = new Date(`${year}-${month}-01 07:00:00`);
        let condition = ` where tr.date_detail > "${
          new Date(firstDay).toISOString().split('T')[0]
        }" and tr.date_detail < "${
          new Date(`${year}-12-31 07:00:00`).toISOString().split('T')[0]
        }"`;

        let cloneListRevenueSQL = listRevenueSQL + `${condition} limit ${limit} offset ${offset}`;
        let cloneQueryCount = queryCount + condition;

        const report_revenue = [];

        for (let i = 0; i < 12; i++) {
          let whereCondition = ` where tr.date_detail >= "${
            new Date(firstDay)
              .addDays(i * 30)
              .toISOString()
              .split('T')[0]
          }" and tr.date_detail <= "${
            new Date(firstDay)
              .addDays((i + 1) * 30)
              .toISOString()
              .split('T')[0]
          }"`;
          let sql = listRevenueSQL + whereCondition;
          promiseQuery.push(addReport(report_revenue, sql));
        }
        await Promise.all(promiseQuery);
        const [listRevenue, numberRevenue] = await Promise.all([
          db.sequelize.query(cloneListRevenueSQL, { type: QueryTypes.SELECT }),
          db.sequelize.query(cloneQueryCount, { type: QueryTypes.SELECT }),
        ]);

        let ticket = report_revenue
          .map((i) => {
            return i
              .map((e) => {
                if (!e.seat) {
                  return 0;
                } else {
                  return e.seat.split(', ').length;
                }
              })
              .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
          })
          .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

        let totalRevenue = report_revenue
          .map((i) => {
            return i
              .map((e) => {
                if (!e.ticket_price) {
                  return 0;
                } else {
                  return e.ticket_price;
                }
              })
              .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
          })
          .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

        let barData = report_revenue.map((i) => {
          return i
            .map((e) => {
              if (!e.ticket_price) {
                return 0;
              } else {
                return e.ticket_price;
              }
            })
            .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        });

        if (listRevenue) {
          return responseHandler.responseWithData(res, 200, {
            list_revenue: listRevenue,
            number_revenue: numberRevenue[0]['count(*)'],
            count_ticket: ticket,
            total_revenue: totalRevenue,
            revenue_report: barData,
          });
        } else {
          return responseHandler.badRequest(res, 'Không thể lấy danh sách thống kê');
        }
      }
    } catch (err) {
      responseHandler.badRequest(res, 'Có lỗi xảy ra khi thao tác. Vui lòng thử lại');
    }
  },
};
