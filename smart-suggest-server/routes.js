const express = require("express");
const router = express.Router();

const itemRoutes = require("./routes/item.route");

router.use("/items", itemRoutes);

module.exports = router;