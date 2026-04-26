import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

// Define __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.memoryStorage();

const uploadPicture = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Increased to 5 MB
  },
  fileFilter: function (req, file, cb) {
    let ext = path.extname(file.originalname).toLowerCase();
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg" && ext !== ".webp") {
      return cb(new Error("Only images (.png, .jpg, .jpeg, .webp) are allowed"));
    }
    cb(null, true);
  },
});


export { uploadPicture };
