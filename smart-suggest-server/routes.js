const express = require("express");
const router = express.Router();

const itemRoutes = require("./routes/item.route");
const cartRoutes = require("./routes/cart.routes")

router.use("/items", itemRoutes);
router.use("/carts", cartRoutes);

module.exports = router;