const mongoose = require("mongoose");

const HotelsSchema =  mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  rating: { type: Number, required: false },
  description: { type: String, required: true },
  pricePerNight: { type: Number, required: true },
  images: { type: [String], required: false },
  recommendations: [
    {
      userName: { type: String,  }, // Make sure userName is required
      message: { type: String,  }, // Make sure message is required
    },
  ],
});

module.exports =HotelsSchema;
