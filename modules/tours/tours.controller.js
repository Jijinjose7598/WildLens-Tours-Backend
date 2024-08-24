const ToursRouter = require("express").Router();
const Tour = require("./tours.model");
const { Types } = require("mongoose");



// create a Tour
//http://localhost:4000/api/tours/create
ToursRouter.post("/create", async (req, res) => {
  const newTour = new Tour(req.body);
  console.log(newTour);
  try {
    const response = await Tour.create(newTour);
    console.log(response);
    return res.status(201).json({
      message: "Tour created successfully",
    });
  } catch (error) {
    return res.json({
      message: "error creating tour",
      error,
    });
  }
});

// 2. Get All Tours
//http://localhost:4000/api/tours/
ToursRouter.get("/", async (req, res) => {
  try {
    const response = await Tour.find(); // [{}, {}] or []
    return res.json({
      message: "Tours fetched successfully",
      data: response,
    });
  } catch (error) {
    console.error("Error fetching tours:", error); // Log the error for debugging

    return res.status(500).json({
      message: "Something went wrong",
      error: error.message || "An unknown error occurred", // Provide error details
    });
  }
});


// 3. Get a tour
// http://localhost:4000/api/tours/tour/1
ToursRouter.get("/tour/:tourId", async (req, res) => {
  const { tourId } = req.params;
  console.log(req.params); // Log to debug

  try {
    const tour = await Tour.findById(tourId);
    if (!tour) {
      return res.status(404).json({ message: "Tour not found" });
    }
    res.status(200).json(tour);
  } catch (error) {
    console.error("Error fetching tour:", error);
    res.status(500).json({ message: "Error fetching tour details", error });
  }
});
// 4. Update a Tour
// http://localhost:3000/api/tours/update/1
ToursRouter.patch("/update/:tourId", async (req, res) => {
  const { tourId } = req.params;
  try {
    const response = await Tour.findOneAndUpdate(
      { _id: tourId },
      { $set: req.body },
      { new: true }
    );
    if (!response) {
      return res.status(404).json({ message: "Tour not found" });
    }
    return res.json({ message: "Tour updated successfully", data: response });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});


// 5. Delete a Tour
// http://localhost:3000/api/tours/delete/1
ToursRouter.delete("/delete/:tourId", async (req, res) => {
  const { tourId } = req.params;
  try {
    const response = await Tour.findOneAndDelete({
      _id: new Types.ObjectId(tourId),
    });
    if (!response) {
      return res.status(404).json({
        message: "Failed deleting Tour! No Tour found",
      });
    } else {
      return res.json({
        message: "Tour deleted successfully",
        data: response,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});


ToursRouter.get("/search", async (req, res) => {
  try {
    const { location, budget, schedule } = req.query;

    const query = {};

    if (location) {
      query.$or = [
        { "location.city": new RegExp(location, "i") },
        { "location.country": new RegExp(location, "i") },
      ];
    }

    if (schedule) query.schedule = new RegExp(schedule, "i");
    if (budget) query.price = { $lte: Number(budget) }; // Convert budget to a number

    const tours = await Tour.find(query);
    res.json(tours);
  } catch (err) {
    console.error("Error occurred in search API:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



ToursRouter.post('/tour/:tourId/review', async (req, res) => {
  const { tourId } = req.params;
  const { user, comment, rating } = req.body;

  try {
    const tour = await Tour.findById(tourId);
    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }

    const newReview = {
      user,
      comment,
      rating,
    };

    tour.reviews.push(newReview);
    await tour.save();

    res.status(201).json({ message: 'Review added successfully', data: tour });
  } catch (error) {
    res.status(500).json({ message: 'Error adding review', error: error.message });
  }
});






module.exports = ToursRouter;
