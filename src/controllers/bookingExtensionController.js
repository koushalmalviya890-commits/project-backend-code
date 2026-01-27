const bookingExtensionService = require("../services/bookingExtensionService");

async function createExtentBooking(req, res) {
  try {
    const { userId } = req.body; // or from auth middleware
    const extension = await bookingExtensionService.createExtension(
      userId,
      req.body,
    );
    res.status(201).json(extension);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
}

async function getExtentBooking(req, res) {
  try {
    const { bookingId } = req.params;
    const extensions =
      await bookingExtensionService.getExtensionsByBooking(bookingId);
    res.json(extensions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch extension requests" });
  }
}

module.exports = {
  createExtentBooking,
  getExtentBooking,
};
