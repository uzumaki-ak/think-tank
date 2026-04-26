import { Schema, model } from "mongoose";

const VisitorLogSchema = new Schema(
  {
    post: { type: Schema.Types.ObjectId, ref: "Post" },
    ip: { type: String, required: true },
    country: { type: String, default: "Unknown" },
    countryCode: { type: String, default: "XX" },
    city: { type: String, default: "Unknown" },
  },
  { timestamps: true }
);

const VisitorLog = model("VisitorLog", VisitorLogSchema);
export default VisitorLog;
