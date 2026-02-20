const crypto = require("crypto");
const Razorpay = require("razorpay");
/**
 * generateRazorpayOrder
 * @param {number} amount - Amount in INR
 * @param {Object} extraOptions - Optional: { receipt, notes, currency }
 * @returns {Promise<Object>} Razorpay Order Object
 */
const generateRazorpayOrder = async (amount, extraOptions = {}) => {
    try {
    const razorpay_api_key = process.env.RAZORPAY_KEY_ID;
    const razorpay_key_secret = process.env.RAZORPAY_KEY_SECRET;

    const instance = new Razorpay({
      key_id: razorpay_api_key,
      key_secret: razorpay_key_secret,
    });

const receipt_id = extraOptions.receipt || `receipt_${Math.floor(Math.random() * 1000000)}`;


 const options = {
      amount: Math.round(amount * 100), // Razorpay uses paise. Rounding prevents float errors.
      currency: extraOptions.currency || "INR",
      receipt: receipt_id,
      notes: extraOptions.notes || {}, // Pass notes if provided
    };

    const order = await instance.orders.create(options);
    return order;
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    throw error;
  }
};

/**
 * verifyPaymentSignature
 * @param {*} razorpay_order_id
 * @param {*} razorpay_payment_id
 * @param {*} razorpay_signature
 * @returns
 */
const verifyPaymentSignature = async (request) => {
  let body = request.razorpay_order_id + "|" + request.razorpay_payment_id;
  const razorpay_key_secret = process.env.RAZORPAY_KEY_SECRET;
  var expectedSignature = crypto
    .createHmac("sha256", razorpay_key_secret)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === request.razorpay_signature) return true;

  return false;
};

/**
 * fetchOrderDetails
 * @param {*} order_id
 */
const fetchOrderDetails = async (order_id) => {
  const razorpay_api_key = process.env.RAZORPAY_KEY_ID;
  const razorpay_key_secret = process.env.RAZORPAY_KEY_SECRET;
  var instance = new Razorpay({
    key_id: razorpay_api_key,
    key_secret: razorpay_key_secret,
  });

  return await instance.orders.fetch(order_id);
};

const fetchPaymentDetails = async (payment_id) => {
  const razorpay_api_key = process.env.RAZORPAY_KEY_ID;
  const razorpay_key_secret = process.env.RAZORPAY_KEY_SECRET;
  const instance = new Razorpay({
    key_id: razorpay_api_key,
    key_secret: razorpay_key_secret,
  });

  return await instance.payments.fetch(payment_id);
};

const fetchPaymentMethod = async (payment_id) => {
  const razorpay_api_key = process.env.RAZORPAY_KEY_ID;
  const razorpay_key_secret = process.env.RAZORPAY_KEY_SECRET;

  const instance = new Razorpay({
    key_id: razorpay_api_key,
    key_secret: razorpay_key_secret,
  });

  const payment = await instance.payments.fetch(payment_id);

  // Extract method details
  const methodDetails = {
    method: payment.method, // upi, card, netbanking, wallet
    bank: payment.bank || null, // only for netbanking
    wallet: payment.wallet || null, // only for wallet
    vpa: payment.vpa || null, // only for UPI
    card: payment.card ? {
      network: payment.card.network,
      type: payment.card.type,
      last4: payment.card.last4
    } : null
  };

  return methodDetails;
};

module.exports = {
  generateRazorpayOrder,
  verifyPaymentSignature,
  fetchOrderDetails,
  fetchPaymentDetails,
  fetchPaymentMethod
};
