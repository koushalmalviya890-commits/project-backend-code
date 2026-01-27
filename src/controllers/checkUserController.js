const { checkUser } = require("../services/checkUserService");

async function checkUserController(req, res) {
  try {
    const { userId, email } = req.body;

    if (!userId && !email) {
      return res.status(400).json({
        error: "userId or email is required",
      });
    }

    const result = await checkUser(userId, email);
    res.json(result);
  } catch (error) {
    console.error("checkuser error:", error);
    res.status(500).json({
      error: "Failed to check user",
    });
  }
}

module.exports = { checkUserController };
