const mongoose = require("mongoose");

const PaymentSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      required: true,
    },
    method: {
      type: String,
      enum: ["credit_card", "paypal", "bank_transfer", "upi"],
      required: true,
    },
  
  },
  {
    timestamps: true,
  }
);

module.exports = PaymentSchema;
