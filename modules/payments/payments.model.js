const mongoose = require("mongoose");
const PaymentSchema = require("./payments.schema");

const PaymentModel = mongoose.model("payment", PaymentSchema);
module.exports = PaymentModel;
