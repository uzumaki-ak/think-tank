import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fileRemover = (filename) => {
fs.unlink(path.join(__dirname, '../uploads', filename), function (err) {
  if(err && err.code == "ENOENT") {
    //file dosent exists
    console.log(`File ${filename} dosent exist, won't remove it`)
  } else if(err) {
    console.error(`Error occurred while deleting file ${filename}`)
  } else {
    console.log(`removed ${filename}`);
  }
});
}
export {fileRemover};