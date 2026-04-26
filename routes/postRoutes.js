import express from "express";
const router = express.Router();
import {
  createPost,
  deletePost,
  getAllPosts,
  getPost,
  updatePost,
  restorePost,
  hardDeletePost,
  getAnalytics,
} from "../controllers/postControllers.js";
import { authGuard, adminGuard } from "../middleware/authMiddleware.js";

router.get("/analytics", authGuard, adminGuard, getAnalytics);
router.route("/").post(authGuard, adminGuard, createPost).get(getAllPosts);
router
  .route("/:slug")
  .put(authGuard, adminGuard, updatePost)
  .delete(authGuard, adminGuard, deletePost)
  .get(getPost);

router.put("/restore/:slug", authGuard, adminGuard, restorePost);
router.delete("/hard-delete/:slug", authGuard, adminGuard, hardDeletePost);

export default router;
