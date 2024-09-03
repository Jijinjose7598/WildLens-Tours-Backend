const mongoose = require("mongoose");

const BookingSchema = mongoose.Schema(
  {
    tour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tour",
      required: false,
    },
    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
      required: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    userName: {
      type:String,
    },
    
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    participants: {
      type: Number,
      required: true,
    },
    totalCost: {
      type: Number,
      required: false,
    },
    companions: {
      type: [String], // Array of strings
      required: false,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "canceled"],
      default: "pending",
    },
    cancellationReason: { type: String },
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: false,
    },
    travel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Travel",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = BookingSchema;
