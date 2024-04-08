const { Users } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/user.repository");

exports.register = async (userData) => {
  try {
    const user = await userRepository.getUserByEmail(userData.email);
    if (user != null) {
      throw new Error("user with given email is already registered");
    }
    bcrypt.hash(userData.password, 10, async function (err, hashed) {
      if (err) {
        throw new Error(err.message);
      }
      userData.password = hashed;
      const createdUser = await Users.create({
        userName: userData.userName,
        imageURL: userData.imageURL,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        password: hashed,
        address: userData.address,
        isAdmin: false,
        isUser: true
      });
    });
  } catch (err) {
    throw err;
  }
};


exports.login = async (req, res, next) => {
  try {
    var userData = req.body;
    var email = userData.email;
    var password = userData.password;
    const user = await userRepository.getUserByEmail(email);
    if (!user) {
      const error = new Error("Invalid Credentials");
      error.statusCode = 401;
      throw error;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error("Invalid Credentials");
      error.statusCode = 401;
      throw error;
    }
    let token = jwt.sign({ uuid: user.uuid }, "thesecrettoken", {
      expiresIn: "30min",
    });
    let refreshToken = jwt.sign({ uuid: user.uuid }, "thesecrettoken", {
      expiresIn: "1d",
    });
    user.refreshToken = refreshToken;
    await user.save();
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({
      message: "Login successful!",
      uuid: user.uuid,
      token,
      refreshToken,
      user,
    });
  } catch (err) {
    throw err;
  }
};

exports.logout = async (req, res, next) => {
  try {

    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);
    const refreshToken = cookies.jwt;

    const foundUser = await User.findOne({ where: { refreshToken } });

    if (!foundUser) {
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });
      return res.sendStatus(204);
    }

    foundUser.refreshToken = "";
    const result = await foundUser.save();

    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    res.sendStatus(204);
  } catch (err) {
    throw err;
  }
};

exports.refresh = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;

    const foundUser = await User.findOne({ where: { refreshToken } });
    if (!foundUser) return res.sendStatus(403);

    jwt.verify(refreshToken, "thesecrettoken", (err, decoded) => {
      if (err || foundUser.uuid.toString() !== decoded.uuid)
        return res.sendStatus(403);
      let token = jwt.sign({ uuid: decoded.uuid }, "thesecrettoken", {
        expiresIn: "30min",
      });
      res.json({
        accessToken: token,
        uuid: foundUser.uuid,
      });
    });
  } catch (err) {
    console.log(err);
  }
};