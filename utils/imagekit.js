import ImageKit from "imagekit"; // The @imagekit/nodejs package still uses "imagekit" as the export name, but we ensure it's the right one.
import dotenv from "dotenv";

dotenv.config();

if (!process.env.IMAGEKIT_PUBLIC_KEY) {
  console.warn("WARNING: IMAGEKIT_PUBLIC_KEY is missing. Image uploads will fail.");
}

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "",
});

export default imagekit;

