const stripe = require("stripe")(
  "sk_test_51PpUAHRwa8jtJ4NfbMcKlqtP0nMaxA7PNF3e7VNa1EiQKcZ1hA23tT3HsIX9liiQS3m9xuKr87j6J3LQ2jThi9ka00jRxKtAVl"
); // Use environment variables for sensitive data

const createCharge = async (amount, currency, source) => {
  try {
    const charge = await stripe.charges.create({
      amount,
      currency,
      source,
      description: "Example charge",
    });
    return charge.id; // This is the transaction ID
  } catch (error) {
    console.error("Error creating charge:", error);
    throw error;
  }
};

module.exports = { createCharge };
