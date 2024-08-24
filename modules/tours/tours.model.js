const mongoose = require("mongoose");
const TourSchema = require("./tours.schema");

const TourModel = mongoose.model("tour", TourSchema);
module.exports = TourModel;
