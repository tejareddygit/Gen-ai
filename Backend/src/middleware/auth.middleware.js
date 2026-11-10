const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../Models/blacklistModel");

async function authUser(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(400).json({
      message: "Token not verified",
    });
  }

  const isTokenBlacklisted = await tokenBlacklistModel.findOne({ token });

  if (isTokenBlacklisted) {
    return res.status(400).json({
      message: "Token is Invalid",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = decoded;

    next();
  } catch (err) {
    return res.status(400).json({
      message: "TOken is not valid",
    });
  }
}

module.exports = { authUser };
