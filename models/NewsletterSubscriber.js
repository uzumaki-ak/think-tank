import { Schema, model } from "mongoose";

const NewsletterSubscriberSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    status: { type: String, default: "active" }, // active, unsubscribed
  },
  { timestamps: true }
);

const NewsletterSubscriber = model("NewsletterSubscriber", NewsletterSubscriberSchema);
export default NewsletterSubscriber;
