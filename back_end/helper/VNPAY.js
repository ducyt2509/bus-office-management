require('dotenv').config();
let dateFormat = require('dateformat');
let crypto = require('crypto');
let querystring = require('qs');

const Transaction = require('../models').transactions;
const tmnCode = process.env.VNPAY_TMNCODE;
const secretKey = process.env.VNPAY_HASH_SECRET;
let vnpUrl = process.env.VNPAY_URL;
let returnUrl = process.env.VNPAY_RETURN_URL;

function encodeObj(obj) {
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
    process.env.TZ = 'Asia/Ho_Chi_Minh';
    let date = new Date();
    let ipAddr =
      req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    let createDate = dateFormat(date, 'yyyymmddHHmmss');
    let orderId = dateFormat(date, 'HHmmss');
    let amount = req.body.amount;
    let bankCode = req.body.bankCode;

    let locale = req.body.language;
    if (locale === null || locale === '') {
      locale = 'vn';
    }
    const dataTransaction = {
      id: orderId,
      vehicle_id: params.vehicle_id,
      passenger_name: params.passenger_name,
      passenger_phone: params.passenger_phone,
      cashier: params.cashier,
      pickup_location_id: params.pickup_location_id,
      drop_off_location_id: params.drop_off_location_id,
      tranship_address: params.tranship_address,
      date_detail: params.date_detail,
      route_id: params.route_id,
      ticket_price: params.ticket_price,
      created_at: date,
      created_by: params.created_by,
      created_on: params.created_on,
      payment_status: 0,
      seat: params.seat,
    };
    let currCode = 'VND';
    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = locale;
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

    vnp_Params = encodeObj(vnp_Params);

    // console.log(decodeObj(vnp_Params)['vnp_OrderInfo']);
    // return;

    console.log(vnp_Params);

    let signData = querystring.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac('sha512', secretKey);
    let signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
    console.log(vnpUrl);
    const createTransaction = await Transaction.create(dataTransaction);
    if (createTransaction) {
      console.log('1');
    } else {
      console.log(2);
    }
    res.redirect(vnpUrl);
  },

  async returnPaymentResult(req, res, next) {
    let vnp_Params = req.query;

    let secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = encodeObj(vnp_Params);

    let signData = querystring.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac('sha512', secretKey);
    let signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');

    if (secureHash === signed) {
      const updateTransaction = await Transaction.update(
        { payment_status: vnp_Params['vnp_ResponseCode'] },
        { where: { id: vnp_Params['vnp_TxnRef'] } }
      );
      if (updateTransaction) {
        res.json({ code: vnp_Params['vnp_ResponseCode'] });
      } else {
        res.json({ code: '97' });
      }
    } else {
      await Transaction.destroy({ where: { id: vnp_Params['vnp_TxnRef'] } });
      res.json({ code: 95 });
    }
  },
};
