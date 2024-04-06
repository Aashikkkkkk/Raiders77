const express = require("express");
const userController = require("../controllers/user.controller");
const router = express.Router();
const loginValidator = require("../validators/login.validator");
const registrationValidator = require("../validators/registration.validator");

router.post(
  "/register",
  registrationValidator,
  userController.register
);
router.post("/login", loginValidator, userController.login);
router.get("/refresh", userController.refresh);
router.post("/logout", userController.logout);

module.exports = router;