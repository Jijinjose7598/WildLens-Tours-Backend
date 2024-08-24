// index.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { initialize_mongo_connectivity } = require("./database/connection");
require("dotenv").config();

const server = express();

server.use(cors());
server.use(bodyParser.json());

server.use("/api/users/", require("./modules/users/users.controller.js"));
server.use("/api/tours/", require("./modules/tours/tours.controller.js"));
server.use(
  "/api/bookings/",
  require("./modules/bookings/bookings.controller.js")
);
server.use(
  "/api/auth",
  require("./modules/authentication/authentication.controller.js")
);

server.use(
  "/api/payments",
  require("./modules/payments/payments.controller.js")
);

server.use(
  "/api/packages",
  require("./modules/packages/packages.controller.js")
);
server.use(
  "/api/hotels",
  require("./modules/hotels/hotels.controller.js")
);



server.listen(3001, "localhost", () => {
  console.log("Server started on http://localhost:3001");
  initialize_mongo_connectivity();
});
