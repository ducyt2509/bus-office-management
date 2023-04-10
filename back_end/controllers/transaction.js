require('dotenv').config();
let dateFormat = require('dateformat');
let crypto = require('crypto');
let querystring = require('qs');

let express = require('express');
let router = express.Router();
let $ = require('jquery');
const request = require('request');
const moment = require('moment');

const db = require('../models');
const Transaction = db.transactions;
const Ticket = db.tickets;
const QueryTypes = db.Sequelize.QueryTypes;
const responseHandler = require('../handlers/response.handler');
const tmnCode = process.env.VNPAY_TMNCODE;
const secretKey = process.env.VNPAY_HASH_SECRET;
let vnpUrl = process.env.VNPAY_URL;
let returnUrl = process.env.VNPAY_RETURN_URL;

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
  }
  return sorted;
}

module.exports = {
  async createPayment(req, res) {
    const params = req.body;
    try {
      process.env.TZ = 'Asia/Ho_Chi_Minh';

      let date = new Date();
      let createDate = moment(date).format('YYYYMMDDHHmmss');
      let ipAddr =
        req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

      let tmnCode = process.env.VNPAY_TMNCODE;
      let secretKey = process.env.VNPAY_HASH_SECRET;
      let vnpUrl = process.env.VNPAY_URL;
      let returnUrl = process.env.VNPAY_RETURN_URL;
      let orderId = moment(date).format('DDHHmmss');
      let amount = parseFloat(req.body.ticket_price);
      let bankCode = req.body.bankCode;
      let locale = req.body.language;
      if (locale === null || locale === '') {
        locale = 'vn';
      }

      const dataTransaction = {
        id: orderId,
        passenger_name: params.passenger_name,
        passenger_phone: params.passenger_phone,
        passenger_email: params.email,
        cashier: params.cashier,
        pickup_location: params.pickup_location,
        drop_off_location: params.drop_off_location,
        note: params.note,
        date_detail: params.date_detail,
        ticket_price: params.ticket_price,
        created_at: date,
        created_by: params.created_by,
        payment_status: params.payment_status,
        seat: params.seat,
        transport_id: parseInt(params.transport),
        tranship_address: params.tranship_address,
      };
      let currCode = 'VND';
      let vnp_Params = {};
      vnp_Params['vnp_Version'] = '2.1.0';
      vnp_Params['vnp_Command'] = 'pay';
      vnp_Params['vnp_TmnCode'] = tmnCode;
      vnp_Params['vnp_Locale'] = 'vn';
      vnp_Params['vnp_CurrCode'] = currCode;
      vnp_Params['vnp_TxnRef'] = orderId;
      vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
      vnp_Params['vnp_OrderType'] = 'other';
      vnp_Params['vnp_Amount'] = amount * 100;
      vnp_Params['vnp_ReturnUrl'] = returnUrl;
      vnp_Params['vnp_IpAddr'] = ipAddr;
      vnp_Params['vnp_CreateDate'] = createDate;
      if (bankCode !== null && bankCode !== '') {
        vnp_Params['vnp_BankCode'] = bankCode;
      }
      vnp_Params = sortObject(vnp_Params);

      let querystring = require('qs');
      let signData = querystring.stringify(vnp_Params, { encode: false });
      let crypto = require('crypto');
      let hmac = crypto.createHmac('sha512', secretKey);
      let signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');
      vnp_Params['vnp_SecureHash'] = signed;
      vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
      const createTransaction = await Transaction.create(dataTransaction);
      if (params.paymentStatusType) {
        if (createTransaction) {
          return responseHandler.responseWithData(res, 200, createTransaction);
        } else {
          return responseHandler.badRequest(res, "Can't create payment");
        }
      } else {
        if (createTransaction) {
          return responseHandler.responseWithData(res, 200, { link_payment: vnpUrl });
        } else {
          return responseHandler.badRequest(res, "Can't create payment");
        }
      }
    } catch (error) {
      console.log(error);
      return responseHandler.badRequest(res, error.message);
    }
  },

  async returnPaymentResult(req, res) {
    let vnp_Params = req.query;

    let secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);

    let signData = querystring.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac('sha512', secretKey);
    let signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');

    if (secureHash === signed) {
      const querySQL = `select t.*, b.vehicle_plate, b.vehicle_type_id, c.city_name as city_from, cc.city_name as city_to  from transaction t
                  join transport tr on tr.id = t.transport_id
                  join bus b on b.id = tr.bus_id
                  join bus_schedule bs on bs.id = tr.bus_schedule_id
                  join route r on r.id = bs.route_id
                  join city c on c.id = r.city_from_id
                  join city cc on cc.id = r.city_to_id where t.id = ${vnp_Params['vnp_TxnRef']}`;
      const [updateTransaction, getTransactionInfo, createTicket] = await Promise.all([
        Transaction.update({ payment_status: 1 }, { where: { id: vnp_Params['vnp_TxnRef'] } }),
        db.sequelize.query(querySQL, { type: QueryTypes.SELECT }),
        Ticket.create({ transaction_id: vnp_Params['vnp_TxnRef'] }),
      ]);
      if (updateTransaction && createTicket) {
        return res.redirect(
          `http://localhost:${process.env.FRONT_END_PORT}/payment?passenger_name=${
            getTransactionInfo[0].passenger_name
          }&passenger_phone=${getTransactionInfo[0].passenger_phone}&pickup_location=${
            getTransactionInfo[0].pickup_location
          }&drop_off_location=${getTransactionInfo[0].drop_off_location}&tranship_address=${
            getTransactionInfo[0].tranship_address
          }&date_detail=${getTransactionInfo[0].date_detail}&ticket_price=${
            getTransactionInfo[0].ticket_price
          }&email=${getTransactionInfo[0].email}&seat=${getTransactionInfo[0].seat}&transport=${
            getTransactionInfo[0].transport_id
          }&paymentStatus=1&route_name=${
            getTransactionInfo[0].city_from + ' - ' + getTransactionInfo[0].city_to
          }&vehicle_plate=${getTransactionInfo[0].vehicle_plate}&vehicle_type_id=${
            getTransactionInfo[0].vehicle_type_id
          }&id=${getTransactionInfo[0].id}`
        );
      } else {
        return res.redirect(
          `http://localhost:${process.env.FRONT_END_PORT}/payment?passenger_name=${
            getTransactionInfo[0].passenger_name
          }&passenger_phone=${getTransactionInfo[0].passenger_phone}&pickup_location=${
            getTransactionInfo[0].pickup_location
          }&drop_off_location=${getTransactionInfo[0].drop_off_location}&tranship_address=${
            getTransactionInfo[0].tranship_address
          }&date_detail=${getTransactionInfo[0].date_detail}&ticket_price=${
            getTransactionInfo[0].ticket_price
          }&email=${getTransactionInfo[0].email}&seat=${getTransactionInfo[0].seat}&transport=${
            getTransactionInfo[0].transport_id
          }&paymentStatus=${vnp_Params['vnp_ResponseCode']}&route_name=${
            getTransactionInfo[0].city_from + ' - ' + getTransactionInfo[0].city_to
          }&vehicle_plate=${getTransactionInfo[0].vehicle_plate}&vehicle_type_id=${
            getTransactionInfo[0].vehicle_type_id
          }&id=${getTransactionInfo[0].id}`
        );
      }
    } else {
      await Transaction.destroy({ where: { id: vnp_Params['vnp_TxnRef'] } });
      return res.redirect(
        `http://localhost:${process.env.FRONT_END_PORT}/payment?passenger_name=${
          getTransactionInfo[0].passenger_name
        }&passenger_phone=${getTransactionInfo[0].passenger_phone}&pickup_location=${
          getTransactionInfo[0].pickup_location
        }&drop_off_location=${getTransactionInfo[0].drop_off_location}&tranship_address=${
          getTransactionInfo[0].tranship_address
        }&date_detail=${getTransactionInfo[0].date_detail}&ticket_price=${
          getTransactionInfo[0].ticket_price
        }&email=${getTransactionInfo[0].email}&seat=${getTransactionInfo[0].seat}&transport=${
          getTransactionInfo[0].transport_id
        }&paymentStatus=${vnp_Params['vnp_ResponseCode']}&route_name=${
          getTransactionInfo[0].city_from + ' - ' + getTransactionInfo[0].city_to
        }&vehicle_plate=${getTransactionInfo[0].vehicle_plate}&vehicle_type_id=${
          getTransactionInfo[0].vehicle_type_id
        }&id=${getTransactionInfo[0].id}`
      );
    }
  },
  async getListPayment(req, res) {
    const params = req.body;
    const limit = params.limit ? params.limit : 7;
    const offset = params.offset ? params.offset : 0;
    const phone = params.phone;
    try {
      const querySQL = `select t.*, b.vehicle_plate, b.vehicle_type_id, c.city_name as city_from, cc.city_name as city_to  from transaction t 
			join transport ts on t.transport_id = ts.id
			join bus b on b.id = ts.bus_id
			join bus_schedule bs on ts.bus_schedule_id = bs.id
			join route r on r.id = bs.route_id
            join city c on r.city_from_id = c.id
            join city cc on r.city_to_id = cc.id
			where t.passenger_phone = '${phone} or t.id = ${phone}'
			limit ${limit} offset ${offset} 
			`;
      let [listTransaction, numberTransaction] = await Promise.all([
        db.sequelize.query(querySQL, { type: QueryTypes.SELECT }),
        Transaction.count({
          where: { passenger_phone: phone },
        }),
      ]);

      if (listTransaction) {
        return responseHandler.responseWithData(res, 200, {
          list_transaction: listTransaction,
          number_transaction: numberTransaction,
        });
      } else {
        return responseHandler.responseWithData(res, 403, {
          message: "Can't get list transaction!",
        });
      }
    } catch (error) {
      return responseHandler.badRequest(res, error.message);
    }
  },
  async getTransactionInformationById(req, res) {
    const params = req.body;
    const id = params.id;
    try {
      const querySQL = `select t.*, b.vehicle_plate, b.vehicle_type_id, c.city_name as city_from, cc.city_name as city_to  from transaction t
                  join transport tr on tr.id = t.transport_id
                  join bus b on b.id = tr.bus_id
                  join bus_schedule bs on bs.id = tr.bus_schedule_id
                  join route r on r.id = bs.route_id
                  join city c on c.id = r.city_from_id
                  join city cc on cc.id = r.city_to_id where t.id = ${id}`;
      const getTransaction = await db.sequelize.query(querySQL, { type: QueryTypes.SELECT });
      if (getTransaction) {
        return responseHandler.responseWithData(res, 200, { transaction: getTransaction[0] });
      } else {
        return responseHandler.badRequest(res, "Can't get transaction information");
      }
    } catch (error) {
      return responseHandler.badRequest(res, error.message);
    }
  },
  async updateTransactionById(req, res) {
    const params = req.body;
    const id = params.id;
    try {
      const updateTransaction = await Transaction.update(params, {
        where: {
          id: id,
        },
      });
      if (updateTransaction) {
        return responseHandler.responseWithData(res, 200, {
          message: 'Transaction update successfully',
        });
      } else {
        return responseHandler.badRequest(res, "Transaction can't update");
      }
    } catch (error) {
      return responseHandler.badRequest(res, error.message);
    }
  },
  async refundPayment(req, res) {
    process.env.TZ = 'Asia/Ho_Chi_Minh';
    let date = new Date();
    let vnp_TxnRef = req.body.order_id;
    let vnp_TransactionDate = dateFormat(req.body.trans_date, 'yyyyMMddHHmmss');
    let vnp_Amount = 0;
    let vnp_TransactionType = '02';
    let vnp_CreateBy = req.body.user;

    const getTransactionInformation = await Transaction({
      where: {
        created_at: req.body.trans_date,
        id: vnp_TxnRef,
      },
    });
    if (getTransactionInformation) {
      vnp_Amount = getTransactionInformation.ticket_price;
    }
    let vnp_RequestId = dateFormat(date, 'HHmmss');
    let vnp_Version = '2.1.0';
    let vnp_Command = 'refund';
    let vnp_OrderInfo = 'Hoan tien GD ma:' + vnp_TxnRef;

    let vnp_IpAddr =
      req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    let vnp_CreateDate = dateFormat(date, 'yyyymmddHHmmss');

    let vnp_TransactionNo = '0';

    let data =
      vnp_RequestId +
      '|' +
      vnp_Version +
      '|' +
      vnp_Command +
      '|' +
      vnp_TmnCode +
      '|' +
      vnp_TransactionType +
      '|' +
      vnp_TxnRef +
      '|' +
      vnp_Amount +
      '|' +
      vnp_TransactionNo +
      '|' +
      vnp_TransactionDate +
      '|' +
      vnp_CreateBy +
      '|' +
      vnp_CreateDate +
      '|' +
      vnp_IpAddr +
      '|' +
      vnp_OrderInfo;
    let hmac = crypto.createHmac('sha512', secretKey);
    let vnp_SecureHash = hmac.update(new Buffer(data, 'utf-8')).digest('hex');

    let dataObj = {
      vnp_RequestId: vnp_RequestId,
      vnp_Version: vnp_Version,
      vnp_Command: vnp_Command,
      vnp_TmnCode: vnp_TmnCode,
      vnp_TransactionType: vnp_TransactionType,
      vnp_TxnRef: vnp_TxnRef,
      vnp_Amount: vnp_Amount,
      vnp_TransactionNo: vnp_TransactionNo,
      vnp_CreateBy: vnp_CreateBy,
      vnp_OrderInfo: vnp_OrderInfo,
      vnp_TransactionDate: vnp_TransactionDate,
      vnp_CreateDate: vnp_CreateDate,
      vnp_IpAddr: vnp_IpAddr,
      vnp_SecureHash: vnp_SecureHash,
    };

    request(
      {
        url: vnp_Api,
        method: 'POST',
        json: true,
        body: dataObj,
      },
      function (error, response, body) {
        console.log(body);
        responseHandler.responseWithData(res, 200, body);
      }
    );
  },
};
