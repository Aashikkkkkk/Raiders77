const itemController = require("../controllers/item.controller");
const createItemValidator = require("../validators/create-item.validator");

const express = require("express");

const router = express.Router();
router.post(
  "/",
  createItemValidator,
  itemController.createItem
);

router.get("/", itemController.getAllItems);

router.get("/:id", itemController.getItemById);

router.delete("/:id", itemController.deleteItemById);

router.put("/:id", itemController.updateItemById);

module.exports = router;