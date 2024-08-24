// routes/hotels.js
const express = require("express");
const HotelsRouter = express.Router();
const Hotel = require("./hotels.model");

// Create a new hotel
HotelsRouter.post("/create", async (req, res) => {
  try {
    const hotel = new Hotel(req.body);
    await hotel.save();
    res.status(201).json(hotel);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all hotels
HotelsRouter.get("/", async (req, res) => {
  try {
    const hotels = await Hotel.find();
    res.status(200).json(hotels);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get a single hotel by ID
HotelsRouter.get("/hotel/:hotelId", async (req, res) => {
  const { hotelId } = req.params;
  console.log(req.params);
  try {
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) return res.status(404).json({ error: "Hotel not found" });
    res.status(200).json(hotel);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a hotel by ID
HotelsRouter.put("/:id", async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!hotel) return res.status(404).json({ error: "Hotel not found" });
    res.status(200).json(hotel);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a hotel by ID
HotelsRouter.delete("/:id", async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndDelete(req.params.id);
    if (!hotel) return res.status(404).json({ error: "Hotel not found" });
    res.status(200).json({ message: "Hotel deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});




HotelsRouter.post("/hotel/:id/recommendations", async (req, res) => {
  try {
    const hotelId = req.params.id;
    const { userName, message } = req.body;

    // Log incoming request body
    console.log("Incoming req.body:", req.body);

    // Validate input
    if (
      typeof userName !== "string" ||
      typeof message !== "string" ||
      !userName.trim() ||
      !message.trim()
    ) {
      return res
        .status(400)
        .json({
          message:
            "User name and message are required and must be non-empty strings.",
        });
    }

    // Find the hotel by ID
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found." });
    }

    // Create a recommendation object
    const recommendation = { userName, message };

    // Add the recommendation to the hotel
    hotel.recommendations.push(recommendation);

    // Log hotel object before saving
    console.log("Hotel with new recommendation:", hotel);

    // Save the hotel with the new recommendation
    await hotel.save();

    res
      .status(200)
      .json({ message: "Recommendation added successfully.", data: hotel });
  } catch (error) {
    console.error("Error adding recommendation:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});




module.exports = HotelsRouter;

