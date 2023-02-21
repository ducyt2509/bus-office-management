const responseWithData = (res, statusCode, data) =>
	res.status(statusCode).send({
		statusCode: statusCode,
		data: data,
	});
const error = (res) =>
	responseWithData(res, 500, {
		message: "Oops! Something wrong in Server!",
	});

const badrequest = (res, message) =>
	responseWithData(res, 400, {
		message,
	});

const ok = (res, message) =>
	responseWithData(res, 200, {
		message,
	});

const unauthorized = (res) =>
	responseWithData(res, 401, {
		message: "Unauthorized",
	});

const notfound = (res) =>
	responseWithData(res, 404, {
		message: "Resource not found ",
	});

module.exports = {
	responseWithData,
	error,
	badrequest,
	ok,
	unauthorized,
	notfound,
};
