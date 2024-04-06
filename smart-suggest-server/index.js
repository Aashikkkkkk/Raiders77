const express = require("express");
const cookieParser = require("cookie-parser");
const db = require("./models");
const app = express();
const routes = require("./routes");
// const authRoutes = require("./routes/authentication.routes.js");
const cors = require("cors");
const corsOptions = require("./utils/corsOption");
// const {
//   validateToken,
// } = require("./utils/authenticationHandler.js");
require("express-async-errors");

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// app.use("/auth", authRoutes);
// app.use(validateToken);
app.use("/api", routes);
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ error: true, message: message });
});

app.listen(3000, () => {
  console.log("server is running at http://localhost:3000");
  db.sequelize.sync().then((req) => {
    console.log("DB synchronized");
  });
});