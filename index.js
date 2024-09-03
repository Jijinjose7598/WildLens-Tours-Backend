// index.js
require("dotenv").config(); // Load environment variables at the very top

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { initialize_mongo_connectivity } = require("./database/connection");

const server = express();

// CORS configuration
const corsOptions = {
  origin: "wild-lens-tours-frontend.vercel.app", 
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // If you need to handle cookies
  optionsSuccessStatus: 204,
};
server.use(cors(corsOptions));

server.use(bodyParser.json());

// Route Handlers
server.use("/api/users", require("./modules/users/users.controller.js"));
server.use("/api/tours", require("./modules/tours/tours.controller.js"));
server.use(
  "/api/bookings",
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
server.use("/api/hotels", require("./modules/hotels/hotels.controller.js"));

// Error Handling Middleware (for unexpected errors)
server.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start Server and Initialize MongoDB Connectivity
server.listen( 3001, "0.0.0.0", async () => {
  console.log(`Server started on http://localhost:${ 3001}`);

  try {
    await initialize_mongo_connectivity();
    console.log("Connected to MongoDB successfully.");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1); // Exit process with failure
  }
});
