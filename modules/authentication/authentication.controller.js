const express = require("express");
const AuthRouter = express.Router();
const User = require("../users/users.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");

// Middleware for token verification
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401); // If no token is found

  jwt.verify(token, "FILE_SYSTEM_SECRET_KEY", (err, user) => {
    if (err) return res.sendStatus(403); // If token is invalid
    req.user = user;
    next();
  });
};

// 1. Create auth
AuthRouter.post(
  "/create",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email address"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    const newUser = new User({ name, email, password });

    try {
      const hash = await bcrypt.hash(newUser.password, 10);
      newUser.password = hash;
      const response = await User.create(newUser);
      return res.status(201).json({
        message: "User created successfully",
        data: response,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error creating user",
        error,
      });
    }
  }
);

// Signin api
AuthRouter.post("/signin", async (req, res) => {
  console.log("HIT");
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      error: "Bad Credentials",
      message: "Email Id is missing",
    });
  }
  if (!password) {
    return res.status(400).json({
      success: false,
      error: "Bad Credentials",
      message: "Password is missing",
    });
  }

  try {
    // Querying db to find any records matching given email
    const response = await User.findOne({ email });
    // IF no accounts matching send below response
    if (!response) {
      return res.status(404).json({
        success: false,
        message: "No accounts found. Create account to continue",
      });
    } else {
      // If password is matching then confirm the login session
      bcrypt
        .compare(password, response.password)
        .then((valid) => {
          if (valid) {
            const token = jwt.sign(
              {
                _id: response._id,
                role: "basic",
              },
              "FILE_SYSTEM_SECRET_KEY",
              {
                expiresIn: "30d",
              }
            );
            return res.status(200).json({
              success: true,
              message: "Login Successfull",
              userId: response._id,
              token,
            });
          } else {
            return res.status(401).json({
              success: false,
              message: "Invalid username or password",
            });
          }
        })
        .catch((error) => {
          throw new Error("Error comparing password");
        });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
});

// Update user password
AuthRouter.patch("/updatePassword/:userId", async (req, res) => {
  const { userId } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({
      error: "Bad Credentials",
      message: "Password is missing",
    });
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    const response = await User.findOneAndUpdate(
      { _id: new Types.ObjectId(userId) },
      { $set: { password: hash } },
      { new: true, projection: { _id: 0 } }
    );

    if (!response) {
      return res.status(404).json({
        message: "Failed updating user password! No User found",
      });
    }

    return res.json({
      message: "Password updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
});

// Initiate Forgot Password
AuthRouter.post("/initiateForgotPassword", async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({
        error: "Bad Credentials",
        message: "Email Id is missing",
      });
    } else {
      const response = await User.findOne({ email });
      if (!response) {
        return res.status(404).json({
          message: "No user found",
        });
      } else {
        // Initiate OTP
        return res.status(200).json({
          message:
            "An email with otp has been sent to your inbox. Kindly check!",
        });
      }
    }
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong!",
    });
  }
});

// Check if user is authenticated
AuthRouter.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password"); // Exclude password
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
});

module.exports = AuthRouter;
