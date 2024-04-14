const itemController = require("../controllers/item.controller");
const createItemValidator = require("../validators/create-item.validator");
const {validateRole} = require("../utils/authenticationHandler")

const express = require("express");

const router = express.Router();
router.post(
  "/", validateRole(["admin"]),
  createItemValidator,
  itemController.createItem
);

router.get("/search", itemController.searchItems);

router.get("/", itemController.getAllItems);

router.get("/:id", itemController.getItemById);

router.delete("/:id", validateRole(["admin"]), itemController.deleteItemById);

router.put("/:id", validateRole(["admin"]), itemController.updateItemById);

module.exports = router;