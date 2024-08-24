const express = require("express");
const UsersRouter = express.Router();
const User = require("./users.model");
const Tour = require("../tours/tours.model"); // Import Tour model if you're using it
const { Types } = require("mongoose");
const Package = require('../packages/packages.model')
const Booking=require("../bookings/bookings.model")

// Helper function to find or create users
const findOrCreateUsers = async (emails) => {
  const users = [];
  for (const email of emails) {
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email }); // Add other default values if necessary
      await user.save();
    }
    users.push(user._id);
  }
  return users;
};

// Route to find or create users by email
UsersRouter.post("/find-or-create", async (req, res) => {
  try {
    const { emails } = req.body;
    const companionIds = await findOrCreateUsers(emails);
    res.json({ ids: companionIds });
  } catch (error) {
    res.status(500).json({ error: "Error processing companion emails" });
  }
});

// Get All Users
UsersRouter.get("/", async (req, res) => {
  try {
    const response = await User.find(); // [{}, {}] or []
    return res.json({
      message: "Users fetched successfully",
      data: response,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
});

// Get a user by ID
UsersRouter.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const response = await User.findOne({
      _id: new Types.ObjectId(userId),
    }); // null/undefined or {}
    if (response) {
      return res.status(200).json({
        message: "User fetched successfully",
        data: response,
      });
    } else {
      return res.status(404).json({
        message: "No User found",
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

// Update a user
UsersRouter.patch("/update/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const response = await User.findOneAndUpdate(
      {
        _id: new Types.ObjectId(userId),
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
        message: "Failed updating user! No User found",
      });
    } else {
      return res.json({
        message: "User updated successfully",
        data: response,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
});

// Delete a user
UsersRouter.delete("/delete/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const response = await User.findOneAndDelete({
      _id: new Types.ObjectId(userId),
    });
    if (!response) {
      return res.status(404).json({
        message: "Failed deleting user! No User found",
      });
    } else {
      return res.json({
        message: "User deleted successfully",
        data: response,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
});

// Get user preferences
UsersRouter.get("/user/:userId/preferences", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("preferences");
    res.json(user.preferences);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user preferences" });
  }
});

// Fetch recommendations based on user preferences
UsersRouter.get("/recommendations/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const recommendations = await Tour.find({
      category: { $in: user.preferences.categories },
    });
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ error: "Error fetching recommendations" });
  }
});


UsersRouter.get('/:userId/tours', async (req, res) => {
  try {
    const tours = await Tour.find({ user: req.params.userId }); // Modify according to your schema
    res.json({ data: tours });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tours' });
  }
});

UsersRouter.get("/:userId/packages", async (req, res) => {
  try {
    const packages = await Package.find({ user: req.params.userId }); // Modify according to your schema
    res.json({ data: packages });
  } catch (error) {
    res.status(500).json({ message: "Error fetching tours" });
  }
});

UsersRouter.get('/:userId/bookings', async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch tours booked or completed by the user
    const tourBookings = await Booking.find({ user: userId })
     
    // console.log(tourBookings);
    // const tours = tourBookings.map(booking => booking.tour);

    // Fetch packages booked or completed by the user
    const packageBookings = await Booking.find({ user: userId })
     
    // console.log(packageBookings)
    // const packages = packageBookings.map(booking => booking.package);

    res.json({ tourBookings, packageBookings });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user bookings' });
  }
});


module.exports = UsersRouter;
