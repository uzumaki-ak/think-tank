// import express from "express";
// import dotenv from "dotenv";
// import { fileURLToPath } from "url";
// import path from "path";
// import connectDB from "./config/db.js";
// import cors from "cors";
// import {
//   errorResponserHandler,
//   invalidPathHandler,
// } from "./middleware/errorHandler.js";

// //Routes
// import userRoutes from "./routes/userRoutes.js";
// import postRoutes from "./routes/postRoutes.js";
// import commentRoutes from "./routes/commentRoutes.js";
// import postCategoriesRoutes from "./routes/postCategoriesRoutes.js";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// dotenv.config();
// connectDB();

// const app = express();
// app.use(express.json());

// const corsOptions = {
//   exposedHeaders: "*",
// };
// app.use(cors(corsOptions));

// // Basic route
// app.get("/", (req, res) => {
//   console.log("Received a request on /");
//   res.send("server is running...");
// });

// app.use("/api/users", userRoutes);
// app.use("/api/posts", postRoutes);
// app.use("/api/comments", commentRoutes);
// app.use("/api/post-categories", postCategoriesRoutes);

// //static assest need to be specified as our browser stop image from getting updated

// app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// app.use(invalidPathHandler);

// app.use(errorResponserHandler);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));


import express from "express";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import connectDB from "./config/db.js";
import cors from "cors";
import {
  errorResponserHandler,
  invalidPathHandler,
} from "./middleware/errorHandler.js";

// Routes
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import postCategoriesRoutes from "./routes/postCategoriesRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

const corsOptions = {
  exposedHeaders: "*",
};
app.use(cors(corsOptions));

// Basic route
app.get("/", (req, res) => {
  console.log("Received a request on /");
  res.send("server is running...");
});

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/post-categories", postCategoriesRoutes);

// Serve static assets (uploads)
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// 🔹 Serve React frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
}

// Error Handling Middleware (must be last)
app.use(invalidPathHandler);
app.use(errorResponserHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
