const crypto = require("crypto");

// If Node < 18
let fetchFn;
try {
  fetchFn = fetch; // Node 18+
} catch {
  fetchFn = require("node-fetch");
}

// ----------------------------------------
// Generate HMAC Signature
// ----------------------------------------

function generateSignature(payload, secret) {
  const body = JSON.stringify(payload);
  
  return crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");
}

// ----------------------------------------
// Send Signed Webhook
// ----------------------------------------

async function sendSignedWebhook({ url, payload, secret }) {
  try {
    const signature = generateSignature(payload, secret);

    const response = await fetchFn(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-webhook-signature": signature,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error("Webhook failed:", response.status);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Webhook send error:", error);
    return false;
  }
}

// ----------------------------------------
// Log Webhook Delivery (DB Optional)
// ----------------------------------------

async function logWebhookDelivery(eventType, payload, success, errorMessage) {
  try {
    console.log("Webhook Log:", {
      eventType,
      success,
      errorMessage,
      timestamp: new Date(),
    });

    // OPTIONAL: Save in DB later if needed
    // db.collection("webhook_logs").insertOne({...})

  } catch (error) {
    console.error("Webhook log error:", error);
  }
}

// ----------------------------------------

module.exports = {
  sendSignedWebhook,
  logWebhookDelivery,
};
