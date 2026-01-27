const startupService = require("../services/startupService");

async function getProfile(req, res) {
  const { userId } = req.params;
  try {
    const profile = await startupService.getProfile(userId);
    if (!profile) {
      return res.status(404).json({ error: "Startup not found" });
    }
    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
}

async function updateProfile(req, res) {
  const { userId } = req.params;

  // optional auth check
  if (req.user && req.user.userId && req.user.userId !== userId) {
    return res.status(403).json({ error: "Forbidden" });
  }

  try {
    const profile = await startupService.updateProfile(userId, req.body);
    if (!profile) {
      return res.status(404).json({ error: "Startup not found" });
    }
    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update profile" });
  }
}

async function getStartupBookings(req, res) {
  const { userId } = req.params;

  try {
    const bookings = await startupService.getStartupBookings(userId);
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching startup bookings:", error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
}


module.exports = {
  getProfile,
  updateProfile,
  getStartupBookings,
};
 