const crypto = require("crypto");

// If Node < 18
let fetchFn;
try {
  fetchFn = fetch; // Node 18+
} catch {
  fetchFn = require("node-fetch");
}

// ----------------------------------------
// Generate HMAC Signature (Timestamp Based)
// ----------------------------------------

function generateSignature(payload, secret, timestamp) {
  const body = JSON.stringify(payload);

  // IMPORTANT: Match Next.js verification format
  const signedPayload = `${timestamp}.${body}`;

  return crypto
    .createHmac("sha256", process.env.WEBHOOK_SECRET)
    .update(signedPayload)
    .digest("hex");
}

// ----------------------------------------
// Send Signed Webhook (With Timeout + Timestamp)
// ----------------------------------------

async function sendSignedWebhook({ url, payload, secret }) {
  try {
    const timestamp = Date.now().toString();

    const signature = generateSignature(payload, secret, timestamp);

    // Timeout protection
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // 5 sec timeout

    const response = await fetchFn(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-webhook-signature": signature,
        "x-webhook-timestamp": timestamp, // REQUIRED for Next.js verification
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      console.error("Webhook failed:", response.status);
      return false;
    }

    return true;
  } catch (error) {
    if (error.name === "AbortError") {
      console.error("Webhook request timed out");
    } else {
      console.error("Webhook send error:", error);
    }

    return false;
  }
}

// ----------------------------------------
// Log Webhook Delivery (Extendable for DB)
// ----------------------------------------

async function logWebhookDelivery(eventType, payload, success, errorMessage) {
  try {
    console.log("Webhook Log:", {
      eventType,
      success,
      errorMessage,
      timestamp: new Date(),
    });

    // OPTIONAL (Production Upgrade)
    // await db.collection("webhook_logs").insertOne({
    //   eventType,
    //   payload,
    //   success,
    //   errorMessage,
    //   createdAt: new Date(),
    // });

  } catch (error) {
    console.error("Webhook log error:", error);
  }
}

// ----------------------------------------

module.exports = {
  sendSignedWebhook,
  logWebhookDelivery,
};
