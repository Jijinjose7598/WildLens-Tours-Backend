const PaymentsRouter = require("express").Router();
const Payment = require("./payments.model");
const { Types } = require("mongoose");
const { createCharge } = require("./server/services/stripeService");
const { createPayment } = require("./server/services/payPalService");
const Booking = require("../bookings/bookings.model")


exports.createPayment = async (req, res) => {
  try {
    const { amount, currency, source, userId } = req.body;
    console.log(req.body);

    // Create charge using Stripe
    const charge = await stripe.charges.create({
      amount,
      currency,
      source,
      description: "Example charge",
    });

    // Save payment information to the database
    const payment = new Payment({
      user: userId,
      amount,
      paymentDate: new Date(),
      status: "pending", // You can update this based on the charge status
      method: "credit_card",
    
    });

    await payment.save();

    res.status(200).json({ paymentId: payment._id, transactionId: charge.id });
  } catch (error) {
    console.error("Error creating payment:", error);
    res.status(500).json({ error: "Payment processing error" });
  }
};



// 1. Create a Payment
//http://localhost:4000/api/payments/create
PaymentsRouter.post("/create", async (req, res) => {
  try {
    const { user, amount, paymentDate, status, method } = req.body;
        
    // Basic validation
    if (!user || !amount || amount <= 0 || !method ) {
      return res.status(400).json({ message: "Invalid payment data" });
    }

    // Validate payment method
    const validMethods = ["credit_card", "paypal", "bank_transfer", "upi"];
    if (!validMethods.includes(method)) {
      return res.status(400).json({ message: "Invalid payment method" });
    }

    // Set default status if not provided
    const paymentStatus = status || "pending";

    // Set payment date to current date if not provided
    const paymentCreationDate = paymentDate || Date.now();

    // Create payment in the database
    const payment = await Payment.create({
      user,
      amount,
      paymentDate: paymentCreationDate,
      status: paymentStatus,
      method,
    
    });

    res.status(201).json({
      message: "Payment successful",
      paymentId: payment._id,
      amount: payment.amount,
      paymentDate: payment.paymentDate,
      status: payment.status,
    });
  } catch (error) {
    console.error("Error creating payment:", error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});


// Route to update payment status
// Route to update payment status
PaymentsRouter.put("/update-status/:id", async (req, res) => {
  try {
    const paymentId = req.params.id;

    // Step 1: Update payment status to "completed"
    const updatedPayment = await Payment.findByIdAndUpdate(
      paymentId,
      { status: "completed" }, // Update status to completed
      { new: true } // Return the updated document
    );
   

    if (!updatedPayment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    // Step 3: Respond with the updated payment and booking
    res.status(200).json({
      message: "Payment and Booking status updated to completed",
      payment: updatedPayment,
    
    });
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({ error: "Failed to update payment status", details: error });
  }
});



// 2. Get All Payments
PaymentsRouter.get("/", async (req, res) => {
  try {
    const response = await Payment.find();
    return res.json({
      message: "Payments fetched successfully",
      data: response,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
});

// 3. Get Payments by User
PaymentsRouter.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const response = await Payment.find({ user: new Types.ObjectId(userId) });
    if (response.length > 0) {
      return res.status(200).json({
        message: "Payments fetched successfully",
        data: response,
      });
    } else {
      return res.status(404).json({
        message: "No Payments found for this user",
        data: [],
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
});

// 4. Update a Payment
PaymentsRouter.patch("/update/:paymentId", async (req, res) => {
  const { paymentId } = req.params;
  try {
    const response = await Payment.findOneAndUpdate(
      {
        _id: new Types.ObjectId(paymentId),
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
        message: "Failed updating payment! No Payment found",
      });
    } else {
      return res.json({
        message: "Payment updated successfully",
        data: response,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

// 5. Delete a Payment
PaymentsRouter.delete("/delete/:paymentId", async (req, res) => {
  const { paymentId } = req.params;
  try {
    const response = await Payment.findOneAndDelete({
      _id: new Types.ObjectId(paymentId),
    });
    if (!response) {
      return res.status(404).json({
        message: "Failed deleting payment! No Payment found",
      });
    } else {
      return res.json({
        message: "Payment deleted successfully",
        data: response,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

module.exports = PaymentsRouter;
