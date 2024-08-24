const mongoose = require("mongoose");
const PackageSchema = require("./packages.schema");

const PackageModel = mongoose.model("package", PackageSchema);
module.exports = PackageModel;
