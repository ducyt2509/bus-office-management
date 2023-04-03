require("dotenv").config();
let dateFormat = require("dateformat");
let crypto = require("crypto");
let querystring = require("qs");
const Location = require("../models").locations;

let express = require("express");
let router = express.Router();
let $ = require("jquery");
const request = require("request");
const moment = require("moment");

const Transaction = require("../models").transactions;
const responseHandler = require("../handlers/response.handler");
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
		sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
	}
	return sorted;
}

module.exports = {
	async createPayment(req, res) {
		const params = req.body;
		try {
			process.env.TZ = "Asia/Ho_Chi_Minh";

			let date = new Date();
			let createDate = moment(date).format("YYYYMMDDHHmmss");
			let ipAddr =
				req.headers["x-forwarded-for"] ||
				req.connection.remoteAddress ||
				req.socket.remoteAddress ||
				req.connection.socket.remoteAddress;

			let tmnCode = process.env.VNPAY_TMNCODE;
			let secretKey = process.env.VNPAY_HASH_SECRET;
			let vnpUrl = process.env.VNPAY_URL;
			let returnUrl = process.env.VNPAY_RETURN_URL;
			let orderId = moment(date).format("DDHHmmss");
			let amount = parseFloat(req.body.ticket_price);
			let bankCode = req.body.bankCode;
			let locale = req.body.language;
			if (locale === null || locale === "") {
				locale = "vn";
			}

			const dataTransaction = {
				id: orderId,
				passenger_name: params.passenger_name,
				passenger_phone: params.passenger_phone,
				cashier: params.cashier,
				pickup_location: params.pickup_location,
				drop_off_location: params.drop_off_location,
				tranship_address: params.tranship_address,
				date_detail: params.date_detail,
				ticket_price: params.ticket_price,
				created_at: date,
				created_by: params.created_by,
				payment_status: 0,
				seat: params.seat,
				transport_id: params.transport_id,
			};
			let currCode = "VND";
			let vnp_Params = {};
			vnp_Params["vnp_Version"] = "2.1.0";
			vnp_Params["vnp_Command"] = "pay";
			vnp_Params["vnp_TmnCode"] = tmnCode;
			vnp_Params["vnp_Locale"] = "vn";
			vnp_Params["vnp_CurrCode"] = currCode;
			vnp_Params["vnp_TxnRef"] = orderId;
			vnp_Params["vnp_OrderInfo"] = "Thanh toan cho ma GD:" + orderId;
			vnp_Params["vnp_OrderType"] = "other";
			vnp_Params["vnp_Amount"] = amount * 100;
			vnp_Params["vnp_ReturnUrl"] = returnUrl;
			vnp_Params["vnp_IpAddr"] = ipAddr;
			vnp_Params["vnp_CreateDate"] = createDate;
			if (bankCode !== null && bankCode !== "") {
				vnp_Params["vnp_BankCode"] = bankCode;
			}
			vnp_Params = sortObject(vnp_Params);

			let querystring = require("qs");
			let signData = querystring.stringify(vnp_Params, { encode: false });
			let crypto = require("crypto");
			let hmac = crypto.createHmac("sha512", secretKey);
			let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
			vnp_Params["vnp_SecureHash"] = signed;
			vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });
			Transaction.create(dataTransaction);
			if (params.paymentStatusType) {
				responseHandler.ok(res);
			} else {
				responseHandler.responseWithData(res, 200, { link_payment: vnpUrl });
			}
		} catch (error) {
			responseHandler.badRequest(res, error.message);
		}
	},

	async returnPaymentResult(req, res) {
		let vnp_Params = req.query;

		let secureHash = vnp_Params["vnp_SecureHash"];

		delete vnp_Params["vnp_SecureHash"];
		delete vnp_Params["vnp_SecureHashType"];

		vnp_Params = sortObject(vnp_Params);

		let signData = querystring.stringify(vnp_Params, { encode: false });
		let hmac = crypto.createHmac("sha512", secretKey);
		let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");

		if (secureHash === signed) {
			const [updateTransaction, getTransactionInfo] = await Promise.all([
				Transaction.update(
					{ payment_status: vnp_Params["vnp_ResponseCode"] },
					{ where: { id: vnp_Params["vnp_TxnRef"] } },
				),
				Transaction.findOne({ where: { id: vnp_Params["vnp_TxnRef"] } }),
			]);
			if (updateTransaction) {
				res.redirect(
					`http://localhost:${process.env.FRONT_END_PORT}/payment?passenger_name=${getTransactionInfo.passenger_name}&passenger_phone=${getTransactionInfo.passenger_phone}&pickup_location=${getTransactionInfo.pickup_location}&drop_off_location=${getTransactionInfo.drop_off_location}&tranship_address=${getTransactionInfo.tranship_address}&date_detail=${getTransactionInfo.date_detail}&ticket_price=${getTransactionInfo.ticket_price}&email=${getTransactionInfo.email}&seat=${getTransactionInfo.seat}&transport=${getTransactionInfo.transport}&paymentStatus=1`,
				);
			} else {
				res.json({ code: "97" });
			}
		} else {
			await Transaction.destroy({ where: { id: vnp_Params["vnp_TxnRef"] } });
			res.json({ code: 95 });
		}
	},
	async getListPayment(req, res) {
		const params = req.body;
		const limit = params.limit;
		const offset = params.offset;
		const orderId = params.order_id;
		const transaction_at = params.transaction_at;
		try {
			let whereCondition = {};
			if (orderId && transaction_at) {
				whereCondition["id"] = orderId;
				transaction_at = dateFormat(transaction_at, "yyyyMMddHHmmss");
				whereCondition["created_at"] = transaction_at;
				const listTransaction = await Transaction.findAll({
					where: whereCondition,
					limit: limit,
					offset: offset,
				});
				if (listTransaction) {
					responseHandler.responseWithData(res, 200, listTransaction);
				} else {
					responseHandler.responseWithData(res, 403, {
						message: "Can't get list transaction!",
					});
				}
			} else {
				responseHandler.responseWithData(res, 403, { message: "Params required!" });
			}
		} catch (error) {
			responseHandler.badRequest(res, error.message);
		}
	},
	async refundPayment(req, res) {
		process.env.TZ = "Asia/Ho_Chi_Minh";
		let date = new Date();
		let vnp_TxnRef = req.body.order_id;
		let vnp_TransactionDate = dateFormat(req.body.trans_date, "yyyyMMddHHmmss");
		let vnp_Amount = 0;
		let vnp_TransactionType = "02";
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
		let vnp_RequestId = dateFormat(date, "HHmmss");
		let vnp_Version = "2.1.0";
		let vnp_Command = "refund";
		let vnp_OrderInfo = "Hoan tien GD ma:" + vnp_TxnRef;

		let vnp_IpAddr =
			req.headers["x-forwarded-for"] ||
			req.connection.remoteAddress ||
			req.socket.remoteAddress ||
			req.connection.socket.remoteAddress;

		let vnp_CreateDate = dateFormat(date, "yyyymmddHHmmss");

		let vnp_TransactionNo = "0";

		let data =
			vnp_RequestId +
			"|" +
			vnp_Version +
			"|" +
			vnp_Command +
			"|" +
			vnp_TmnCode +
			"|" +
			vnp_TransactionType +
			"|" +
			vnp_TxnRef +
			"|" +
			vnp_Amount +
			"|" +
			vnp_TransactionNo +
			"|" +
			vnp_TransactionDate +
			"|" +
			vnp_CreateBy +
			"|" +
			vnp_CreateDate +
			"|" +
			vnp_IpAddr +
			"|" +
			vnp_OrderInfo;
		let hmac = crypto.createHmac("sha512", secretKey);
		let vnp_SecureHash = hmac.update(new Buffer(data, "utf-8")).digest("hex");

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
				method: "POST",
				json: true,
				body: dataObj,
			},
			function (error, response, body) {
				console.log(body);
				responseHandler.responseWithData(res, 200, body);
			},
		);
	},
};
