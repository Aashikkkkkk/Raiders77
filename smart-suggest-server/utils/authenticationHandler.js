const { User } = require("../models");
const { getUserById } = require("../repositories/user.repository");
const jwt = require("jsonwebtoken");

exports.validateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (authHeader === null || authHeader === undefined) {
    res.status(400).send("Token not present");
  } else {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, "thesecrettoken", async (err, userData) => {
      if (err) {
        res.status(403).send("Token invalid");
      } else {
        req.user = await getUserById(userData.uuid);
        next();
      }
    });
  }
};

exports.validateRole = (roles) => {
  return (req, res, next) => {
    let isAuthorized = false;
    roles.forEach((role) => {
      if (role === "admin") {
        if (req?.user?.isAdmin) {
          isAuthorized = true;
          return;
        }
      } else if (role === "user") {
        if (req?.user?.isUser) {
          isAuthorized = true;
          return;
        }
      }
    });
    if (isAuthorized) {
      next();
    } else {
      res.status(401).send("Unauthorized");
    }
  };
};
