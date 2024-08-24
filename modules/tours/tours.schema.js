const mongoose = require("mongoose");

const TourSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      country: { type: String, required: true },
      city: { type: String, required: true },
    },
    duration: {
      type: Number, // Duration in days
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    capacity: {
      type: Number, // Maximum number of participants
      required: true,
    },
   
    images: [String], // Array of image URLs
    overview: {
      type: String,
      required: false,
      trim: true,
    },
    highlights: [
      {
        type: String,
        required: true,
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
        description: { type: String }, // Optional description for the schedule date
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = TourSchema;
