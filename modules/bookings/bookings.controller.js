const BookingRouter = require("express").Router();
const Booking = require("./bookings.model");


const Tour = require("../tours/tours.model");
const Package = require("../packages/packages.model");
const User = require("../users/users.model");
const { Types } = require("mongoose");

// Ensure the User model is registered with Mongoose
const mongoose = require("mongoose");
const BookingSchema = require("./bookings.schema"); // Adjust the path if needed
mongoose.model("Booking", BookingSchema);

const UserSchema = require("../users/users.schema");
mongoose.model("User", UserSchema);

const TourSchema = require("../tours/tours.schema");
mongoose.model("Tour", TourSchema);

// Helper function to send a review form
const sendReviewForm = (userEmail, bookingId) => {
  console.log(
    `Sending review form to ${userEmail} for booking ID: ${bookingId}`
  );
  // Integrate with an email service to send the review form.
};

// 1. Create a tour booking
BookingRouter.post("/tour/create", async (req, res) => {
  try {
    const {
      name,
      startDate,
      endDate,
      adults,
      kids,
      participants,
      companions,
      user,
      tour,
      hotel,
      
    } = req.body;

    if (!user || !tour) {
      return res
        .status(400)
        .json({ message: "User ID and Tour ID are required" });
    }

    const newBooking = new Booking({
      name,
      startDate,
      endDate,
      adults,
      kids,
      participants,
      companions,
      user,
      tour,
      hotel,
   
    });

    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


BookingRouter.post("/package/create", async (req, res) => {
  try {
    const {
      name,
      startDate,
      endDate,
      adults,
      kids,
      participants,
      companions,
      user,
      package: packageId,
      hotel, // Added hotel field
     
    } = req.body;

    if (!user || !packageId) {
      return res
        .status(400)
        .json({ message: "User ID and Package ID are required" });
    }

    const pkg = await Package.findById(packageId);
    if (!pkg) {
      return res.status(404).json({ message: "Package not found" });
    }

    const newBooking = new Booking({
      name,
      startDate,
      endDate,
      adults,
      kids,
      participants,
      companions,
      user,
      package: packageId,
      hotel, // Store hotel
     
    });

    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    console.error("Error creating booking:", error.message);
    res.status(500).json({ message: error.message });
  }
});


// 3. Get all bookings
BookingRouter.get("/", async (req, res) => {
  try {
    const response = await Booking.find();
    return res.json({
      message: "Bookings fetched successfully",
      data: response,
    });
  } catch (error) {
    console.error("Error fetching Bookings:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message || "An unknown error occurred",
    });
  }
});

// 4. Get a single booking
BookingRouter.get("/booking/:bookingId", async (req, res) => {
  const { bookingId } = req.params;
  try {
    const response = await Booking.findOne({
      _id: new Types.ObjectId(bookingId),
    });
    if (response) {
      return res.status(200).json({
        message: "Booking fetched successfully",
        data: response,
      });
    } else {
      return res.status(404).json({
        message: "No Booking found",
        data: {},
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
});

// 5. Update a booking
BookingRouter.patch("/update/:bookingId", async (req, res) => {
  const { bookingId } = req.params;
  try {
    const response = await Booking.findOneAndUpdate(
      {
        _id: new Types.ObjectId(bookingId),
      },
      {
        $set: req.body,
      },
      {
        new: true,
        projection: {
          _id: 0,
        },
      }
    );
    if (!response) {
      return res.status(404).json({
        message: "Failed updating Booking! No Booking found",
      });
    } else {
      return res.json({
        message: "Booking updated successfully",
        data: response,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

// 6. Delete a booking
BookingRouter.delete("/delete/:bookingId", async (req, res) => {
  const { bookingId } = req.params;
  try {
    const response = await Booking.findOneAndDelete({
      _id: new Types.ObjectId(bookingId),
    });
    if (!response) {
      return res.status(404).json({
        message: "Failed deleting Booking! No Booking found",
      });
    } else {
      return res.json({
        message: "Booking deleted successfully",
        data: response,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

BookingRouter.get("/send-review-forms", async (req, res) => {
  try {
    // Get the current date
    const today = new Date();
    // Set the start and end of the day for today's date
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      0,
      0,
      0,
      0
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59,
      999
    );

    // Find bookings with an end date of today
    const bookings = await Booking.find({
      endDate: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    }).populate("user");

    console.log(bookings);

    // Track bookings that need review forms
    const reviewFormsData = bookings.map((booking) => ({
      bookingId: booking._id,
      userEmail: booking.user?.email,
    }));

    // Return the review forms data
    res.status(200).json({
      message: "Review forms data fetched successfully",
      data: reviewFormsData,
    });
  } catch (error) {
    console.error("Error sending review forms:", error);
    res.status(500).send({ message: "Error sending review forms" });
  }
});


BookingRouter.post("/submit-review", async (req, res) => {
  try {
    const { bookingId, rating, comment, type } = req.body;

    if (!["tour", "package"].includes(type)) {
      return res.status(400).json({ message: "Invalid type specified" });
    }

    // Find the associated booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Find the Tour or Package based on the type and ID from the booking
    const itemId = type === "tour" ? booking.tour : booking.package;
    const Model = type === "tour" ? Tour : Package;

    const item = await Model.findById(itemId);
    if (!item) {
      return res.status(404).json({
        message: `${type.charAt(0).toUpperCase() + type.slice(1)} not found`,
      });
    }

    // Create the review object
    const review = {
      user: booking.user,
      rating,
      comment,
      createdAt: new Date(),
      completed: true,
    };

    // Push the review into the corresponding array
    item.reviews.push(review);

    // Save the updated document
    await item.save();

    // Return a success message
    res.status(201).json({ message: "Review submitted successfully", review });
  } catch (error) {
    console.error("Error submitting review:", error);
    res.status(500).json({ message: "Error submitting review" });
  }
});





// 7. Mark a booking as completed
BookingRouter.patch("/complete/:bookingId", async (req, res) => {
  const { bookingId } = req.params;
  try {
    const updatedBooking = await Booking.findOneAndUpdate(
      { _id: new Types.ObjectId(bookingId) },
      { $set: { paymentStatus: 'completed' } },
      { new: true }
    );
    console.log(updatedBooking);
    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json({ message: "Booking marked as completed", data: updatedBooking });
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({ message: "Error updating booking status" });
  }
});

BookingRouter.patch("/canceled/:bookingId", async (req, res) => {
  const { bookingId } = req.params;
  const { reason } = req.body;

  try {
    const updatedBooking = await Booking.findOneAndUpdate(
      { _id: new Types.ObjectId(bookingId) },
      { $set: { paymentStatus: "canceled", cancellationReason: reason } },
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res
      .status(200)
      .json({ message: "Booking marked as canceled", data: updatedBooking });
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({ message: "Error updating booking status" });
  }
});





module.exports = BookingRouter;
