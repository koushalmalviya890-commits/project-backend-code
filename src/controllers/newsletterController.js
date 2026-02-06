const newsletterService = require("../../services/newsletterService");

exports.subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const result = await newsletterService.subscribeEmail(email);

    if (result.alreadySubscribed) {
      return res.json({ message: "You are already subscribed" });
    }

    res.json({ message: "Subscribed successfully" });
  } catch (error) {
    console.error("Newsletter subscription error:", error);

    // Duplicate key safety
    if (error.code === 11000) {
      return res.json({ message: "You are already subscribed" });
    }

    res.status(500).json({ message: "Failed to subscribe" });
  }
};
