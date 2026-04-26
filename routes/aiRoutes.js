import express from "express";
const router = express.Router();
import { generateIntelligence } from "../controllers/aiControllers.js";

router.post("/query", generateIntelligence);

export default router;
