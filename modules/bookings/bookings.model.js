const mongoose = require("mongoose");
const BookingSchema = require("./bookings.schema");

const BookingModel = mongoose.model("booking", BookingSchema);
module.exports = BookingModel;
