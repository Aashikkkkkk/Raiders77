const User = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userService = require("../services/user.service");

exports.register = async (req, res, next) => {
  try {
    await userService.register(req.body);
    res.json({
      status: 200,
      message: "user registered successfully!!!",
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    await userService.login(req, res, next);
  } catch (err) {
    next(err);
  }
};

exports.refresh = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;

    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) return res.sendStatus(403);
    jwt.verify(refreshToken, "thesecrettoken", (err, decoded) => {
      if (err || foundUser._id.toString() !== decoded.id)
        return res.sendStatus(403);
      let token = jwt.sign({ id: decoded.id }, "thesecrettoken", {
        expiresIn: "30min",
      });
      res.json({
        accessToken: token,
        id: foundUser.id,
        role: {
          isBookingUser: foundUser.isBookingUser,
          isStaff: foundUser.isStaff,
          isSuperAdmin: foundUser.isSuperAdmin,
        },
      });
    });
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    await userService.logout(req, res, next);
  } catch (err) {
    next(err);
  }
};