const PackagesRouter = require("express").Router();
const Package = require("./packages.model");
const { Types } = require("mongoose");

// Get all packages
PackagesRouter.get('/', async (req, res) => {
  try {
    const packages = await Package.find();
    res.json({ data: packages });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new package
PackagesRouter.post("/create", async (req, res) => {
  const { title, description, price, duration, features, images } = req.body;

  const newPackage = new Package({
    title,
    description,
    price,
    duration,
    features, // Include features in the package creation
    images,
  });

  try {
    const savedPackage = await newPackage.save();
    res.status(201).json(savedPackage);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get a Package by ID
PackagesRouter.get("/package/:id", async (req, res) => {
  try {
    const package = await Package.findById(req.params.id);
    if (!package) {
      return res.status(404).json({ message: "Package not found" });
    }
    res.json({ data: package });
  } catch (error) {
    console.error("Error fetching package:", error);
    res.status(500).json({ message: "Error fetching package", error });
  }
});
// Update a Package
PackagesRouter.patch("package/update/:packageId", async (req, res) => {
  const { packageId } = req.params;
  try {
    const response = await Package.findOneAndUpdate(
      { _id: new Types.ObjectId(packageId) },
      { $set: req.body },
      { new: true }
    )
    if (response) {
      return res.json({
        message: "Package updated successfully",
        data: response,
      });
    } else {
      return res.status(404).json({
        message: "No Package found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Error updating package",
      error,
    });
  }
});

// Delete a Package
PackagesRouter.delete("/delete/:packageId", async (req, res) => {
  const { packageId } = req.params;
  try {
    const response = await Package.findOneAndDelete({
      _id: new Types.ObjectId(packageId),
    });
    if (response) {
      return res.json({
        message: "Package deleted successfully",
        data: response,
      });
    } else {
      return res.status(404).json({
        message: "No Package found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Error deleting package",
      error,
    });
  }
});

// Get most selling packages
PackagesRouter.get("/most-selling", async (req, res) => {
  try {
    const mostSellingPackages = await Package.find({ isBestSelling: true });
    console.log(mostSellingPackages)
    res.json({ success: true, data: mostSellingPackages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


PackagesRouter.post("/package/:packageId/review", async (req, res) => {
  const { packageId } = req.params;
  const { user, comment, rating } = req.body;

  try {
    // Find the package by ID
    const pkg = await Package.findById(packageId);
    if (!pkg) {
      return res.status(404).json({ message: "Package not found" });
    }

    // Create a new review object
    const newReview = {
      user,
      comment,
      rating,
    };

    // Push the new review into the reviews array
    pkg.reviews.push(newReview);

    // Save the package with the new review
    await pkg.save();

    res.status(201).json({ message: "Review added successfully", data: pkg });
  } catch (error) {
    console.error("Error adding review:", error.message);
    res
      .status(500)
      .json({ message: "Error adding review", error: error.message });
  }
});

module.exports = PackagesRouter;
