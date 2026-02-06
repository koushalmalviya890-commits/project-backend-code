const { checkUser } = require("../../services/checkUserService");

async function checkUserController(req, res) {
  try {
    const userId = req.user?.id || req.body.userId;
    const email = req.user?.email || req.body.email;

    const { incubatorId } = req.body;

    if (!userId && !email) {
      return res.status(400).json({
        error:
          "User ID could not be determined. Ensure Authorization token is sent.",
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
