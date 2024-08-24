const mongoose = require("mongoose");

// Define the schema
const PackageSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    bookings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
      },
    ],
    features: {
      type: {
        food: { type: Boolean, default: false },
        hotel: { type: Boolean, default: false },
        taxi: { type: Boolean, default: false },
      },
   
    },
    isBestSelling: {
      type: Boolean,
      default: false,
    },
    images: [
      {
        type: String,
      },
    ],
    overview: {
      type: String,
      required: false,
    },
    highlights: [
      {
        type: String,
      },
    ],
    reviews: [
      {
        user: {
          type: String,
          ref: "User",
          required: false,
        },
        rating: {
          type: Number,
          required: false,
          min: 1,
          max: 5,
        },
        comment: {
          type: String,
          required: false,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        completed: {
          type: Boolean,
          required: false,
          default: false,
        },
      },
    ],
    schedule: [
      {
        description: { type: String }, 
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Create and export the model
module.exports =  PackageSchema;
