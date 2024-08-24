const mongoose = require("mongoose");
const HotelsSchema = require("./hotels.schema");

const HotelsModel = mongoose.model("hotels", HotelsSchema);
module.exports = HotelsModel;
