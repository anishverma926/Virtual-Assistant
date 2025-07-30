import express from "express";
import geminiResponse from "../gemini.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { prompt, assistantName, userName } = req.body;
  try {
    const response = await geminiResponse(prompt, assistantName, userName);
    res.status(200).json({ response });
  } catch (error) {
    console.error("Gemini API error:", error);
    res.status(500).json({ error: "Failed to generate response" });
  }
});

export default router;
