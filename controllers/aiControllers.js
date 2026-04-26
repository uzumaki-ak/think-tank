import { GoogleGenerativeAI } from "@google/generative-ai";

const generateIntelligence = async (req, res, next) => {
  try {
    const { prompt, context } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ message: "PROMPT_MISSING: Analytical target undefined." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.json({ 
        role: "assistant", 
        content: "[SIMULATION_MODE] SYSTEM_OFFLINE: GEMINI_API_KEY is missing. Add your key to the environment to enable live intelligence." 
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const systemPrompt = `You are the ThinkTank Editorial Intelligence Agent. 
    A high-end, minimalist, industrial-focused assistant. 
    User Context: ${context || "Public Research"}.
    Response Style: Concise, brutalist, precise, monochromatic in tone.
    Start responses with a status code like [ANALYSIS_ACTIVE] or [DATA_SYNC].`;

    try {
      const result = await model.generateContent(`${systemPrompt}\n\nUser Query: ${prompt}`);
      const response = await result.response;
      const text = response.text();

      if (!text) {
        throw new Error("EMPTY_REASONING: The AI core returned an empty response.");
      }

      return res.json({
        role: "assistant",
        content: text,
      });
    } catch (aiError) {
      console.error("AI_ENGINE_FAILURE:", aiError);
      return res.status(500).json({ 
        message: "AI_ENGINE_FAILURE: The intelligence core encountered an anomaly.",
        details: aiError.message || "Unknown Service Error",
        role: "assistant",
        content: `SYSTEM_ERROR: ${aiError.message || "Anomaly detected in reasoning protocol."}`
      });
    }
  } catch (error) {
    next(error);
  }
};

export { generateIntelligence };
