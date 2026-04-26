import express from "express";
const router = express.Router();
import { generateIntelligence } from "../controllers/aiControllers.js";

import { authGuard } from "../middleware/authMiddleware.js";

router.post("/query", authGuard, generateIntelligence);

export default router;
