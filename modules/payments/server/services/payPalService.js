const axios = require("axios");

const createPayment = async (amount, currency) => {
  try {
    const response = await axios.post(
      "https://api-m.sandbox.paypal.com/v1/payments/payment",
      {
        intent: "sale",
        payer: { payment_method: "paypal" },
        transactions: [{ amount: { total: amount, currency: currency } }],
        redirect_urls: {
          return_url: "http://your-site.com/success",
          cancel_url: "http://your-site.com/cancel",
        },
      },
      {
        headers: { Authorization: `Bearer ${process.env.PAYPAL_ACCESS_TOKEN}` },
      }
    );
    return response.data.id; // This is the transaction ID
  } catch (error) {
    console.error("Error creating payment:", error);
    throw error;
  }
};

module.exports = { createPayment };
