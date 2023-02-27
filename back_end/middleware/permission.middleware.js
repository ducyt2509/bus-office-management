const jwt = require('jsonwebtoken');
const responseHandler = require('../handlers/response.handler');

const middleWareController = {
  verifyToken(req, res, next) {
    const token = req.headers.token;
    if (token) {
      const accessToken = token.split(' ')[1];
      jwt.verify(accessToken, process.env.JWT_SECRET_TOKEN, (error, user) => {
        if (error) {
          responseHandler.unauthorized(res);
        }
        req.user = user;
        next();
      });
    } else {
      responseHandler.responseWithData(res, 401, { message: 'You are not authenticated!' });
    }
  },
  verifyTokenForManager(req, res, next) {
    middleWareController.verifyToken(req, res, () => {
      if (req.user.role_id == 1) {
        next();
      } else {
        responseHandler.unauthorized(res);
      }
    });
  },
  verifyTokenForStaff(req, res, next) {
    middleWareController.verifyToken(req, res, () => {
      if (req.user.role_id == 2) {
        next();
      } else {
        responseHandler.unauthorized(res);
      }
    });
  },
};
module.exports = middleWareController;
