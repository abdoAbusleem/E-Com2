const jwt = require("jsonwebtoken");
const httpStatusText = require("../Enums/httpStatusText");
const appError = require("../utils/appError");
const { isTokenExpired } = require("../utils/checkTokenExpiry");

const verifyToken = (req, res, next) => {
  const token = req.cookies.accessToken; // Get the token from cookies
  if (!token || isTokenExpired(token)) {
    const error = appError.create("Please log in", 400, httpStatusText.FAIL);
    return next(error);
  }

  try {
    const currentUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.currentUser = currentUser;
    return next();
  } catch (e) {
    const error = appError.create("Invalid token", 401, httpStatusText.ERROR);
    return next(error);
  }
};

module.exports = verifyToken;
