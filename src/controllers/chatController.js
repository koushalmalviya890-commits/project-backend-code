

const AI_ENDPOINT = "https://cummaai-499831567403.us-central1.run.app/query";

async function chatWithAI(req, res) {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const aiResponse = await fetch(AI_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question: message }),
    });

    if (!aiResponse.ok) {
      throw new Error("AI service responded with an error");
    }

    const data = await aiResponse.json();

    return res.json({ response: data.answer });
  } catch (error) {
    console.error("Chat API error:", error);
    return res.status(500).json({
      error: "Failed to process message",
    });
  }
}

module.exports = { chatWithAI };
