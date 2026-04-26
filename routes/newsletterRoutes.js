import express from "express";
const router = express.Router();
import { subscribe, getSubscribers } from "../controllers/newsletterControllers.js";
import { authGuard, adminGuard } from "../middleware/authMiddleware.js";

router.post("/subscribe", subscribe);
router.get("/", authGuard, adminGuard, getSubscribers);

export default router;
