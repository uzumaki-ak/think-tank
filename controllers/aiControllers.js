import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

const generateIntelligence = async (req, res, next) => {
  try {
    const { prompt, context } = req.body;
    if (!genAI) {
      return res.json({ 
        role: "assistant", 
        content: "SYSTEM_OFFLINE: GEMINI_API_KEY is missing. AI reasoning is currently simulated." 
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const systemPrompt = `You are the ThinkTank Editorial Intelligence Agent. 
    A high-end, minimalist, industrial-focused assistant. 
    User Context: ${context || "Public Research"}.
    Response Style: Concise, brutalist, precise, monochromatic in tone.
    Start responses with a status code like [ANALYSIS_ACTIVE] or [DATA_SYNC].`;

    const result = await model.generateContent(`${systemPrompt}\n\nUser Query: ${prompt}`);
    const response = await result.response;
    const text = response.text();

    return res.json({
      role: "assistant",
      content: text,
    });
  } catch (error) {
    next(error);
  }
};

export { generateIntelligence };
