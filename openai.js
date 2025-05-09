const express = require('express');
const OpenAI = require("openai");
const router = express.Router();

const useMockMode = process.env.MOCK_MODE === "true";

router.post('/chat', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || prompt.trim() === "") {
    return res.status(400).json({ reply: "Prompt is empty." });
  }

  if (useMockMode) {
    // 🧪 MOCK REPLY
    return res.json({ reply: `🧠 MOCK MODE: You asked "${prompt}", and this is a pretend answer.` });
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({ reply: response.choices[0].message.content.trim() });
  } catch (error) {
    console.error("❌ OpenAI API error:", error?.response?.data || error.message || error);
    res.status(500).json({ reply: "Error connecting to OpenAI API." });
  }
});

module.exports = router;



