const getMapEmbed = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY 
      

    // FIX 1: Added '$' before {apiKey}
    // FIX 2: Used the standard Embed API URL structure (recommended)
    const embedUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(query)}`;

    // If you strictly want to use your original URL format, use this instead:
    // const embedUrl = `https://www.google.com/maps/embed/v1/place?key=$${apiKey}&q=${encodeURIComponent(
    //   query
    // )}`;

    return res.json({
      embedUrl,
    });
  } catch (error) {
    console.error("Maps API error:", error);
    return res.status(500).json({ error: "Failed to process maps request" });
  }
};
module.exports = {
  getMapEmbed,
};
