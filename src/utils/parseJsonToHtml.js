import { generateHTML } from "@tiptap/html";

import parse from "html-react-parser";
import { extensions } from "../constants/tiptapExtensions";

const parseJsonToHtml = (json) => {
  try {
    return parse(generateHTML(json, extensions));
  } catch (error) {
    console.error("Error parsing JSON to HTML:", error);
    return ""; // Return an empty string or some default value
  }
};


export default parseJsonToHtml;
