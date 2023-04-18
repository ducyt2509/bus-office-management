const jwt = require('jsonwebtoken');
const responseHandler = require('../handlers/response.handler');

const middleWareController = {
  verifyToken(req, res, next) {
    const token = req.headers.token;
    if (token) {
      const accessToken = token.split(' ')[1];
      jwt.verify(accessToken, process.env.JWT_SECRET_TOKEN, (error, user) => {
        if (error) {
          return responseHandler.unauthorized(res);
        }
        req.user = user;
        next();
      });
    } else {
      return responseHandler.unauthorized(res);
    }
  },
  verifyTokenForManager(req, res, next) {
    middleWareController.verifyToken(req, res, () => {
      if (req.user.role_id == 1) {
        next();
      } else {
        return responseHandler.unauthorized(res);
      }
    });
  },
  verifyTokenForStaff(req, res, next) {
    middleWareController.verifyToken(req, res, () => {
      if (req.user.role_id == 1 || req.user.role_id == 2) {
        next();
      } else {
        return responseHandler.unauthorized(res);
      }
    });
  },
  verifyTokenForDriver(req, res, next) {
    middleWareController.verifyToken(req, res, () => {
      if (req.user.role_id == 1 || req.user.role_id == 3) {
        next();
      } else {
        return responseHandler.unauthorized(res);
      }
    });
  },
  verifyTokenForCustomer(req, res, next) {
    middleWareController.verifyToken(req, res, () => {
      if (req.user.role_id == 1 || req.user.role_id == 2 || req.user.role_id == 3) {
        next();
      } else {
        return responseHandler.unauthorized(res);
      }
    });
  },
};
module.exports = middleWareController;
