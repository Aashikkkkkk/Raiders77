const cartController = require("../controllers/cart.controller");

const express = require("express");

const router = express.Router();

router.post("/", cartController.addToCart);

router.post("/checkout", cartController.checkout);

router.get("/", cartController.getCartByUserId);

router.delete("/", cartController.deleteCartByUserId);

module.exports = router;
