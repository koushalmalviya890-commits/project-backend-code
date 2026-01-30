const { getCustomersForProvider } = require("../services/customersService");

async function getCustomers(req, res) {
  try {
    const { providerUserId } = req.params;

    if (!providerUserId) {
      return res.status(400).json({
        error: "providerUserId is required",
      });
    }

    const customers = await getCustomersForProvider(providerUserId);
    res.json(customers);
  } catch (error) {
    console.error("Customers API error:", error);
    res.status(500).json({
      error: "Failed to fetch customers",
    });
  }
}

module.exports = { getCustomers };
