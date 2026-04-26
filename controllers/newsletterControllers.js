import { Resend } from "resend";
import NewsletterSubscriber from "../models/NewsletterSubscriber.js";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const subscribe = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      const error = new Error("Email is required");
      return next(error);
    }

    let subscriber = await NewsletterSubscriber.findOne({ email });
    if (subscriber) {
      if (subscriber.status === "active") {
        const error = new Error("PROTOCOL_ALREADY_ACTIVE: You are already subscribed.");
        return next(error);
      } else {
        subscriber.status = "active";
        await subscriber.save();
      }
    } else {
      subscriber = await NewsletterSubscriber.create({ email });
    }

    // Send Welcome Email if Resend is configured
    if (resend) {
      try {
        await resend.emails.send({
          from: "ThinkTank <onboarding@resend.dev>", // Replace with verified domain in production
          to: email,
          subject: "[SYSTEM_SYNC] Intelligence Protocol Active",
          html: `
            <div style="font-family: monospace; background: #050505; color: #f2f2f2; padding: 40px; border: 1px solid #1a1a1a;">
              <h1 style="text-transform: uppercase; letter-spacing: -1px;">Intelligence Protocol <span style="font-style: italic; font-weight: normal;">Active</span></h1>
              <p style="opacity: 0.6; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">Your terminal has been successfully synchronized with the ThinkTank network.</p>
              <hr style="border: none; border-top: 1px solid #1a1a1a; margin: 40px 0;" />
              <p style="font-size: 10px; opacity: 0.4;">V.01.2026 / STABLE NODE</p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error("Resend Sync Error:", emailError.message);
      }
    }

    return res.status(201).json({
      message: "PROTOCOL_INITIATED: Subscription active.",
    });
  } catch (error) {
    next(error);
  }
};

const getSubscribers = async (req, res, next) => {
  try {
    const subscribers = await NewsletterSubscriber.find({}).sort({ createdAt: -1 });
    return res.json(subscribers);
  } catch (error) {
    next(error);
  }
};

export { subscribe, getSubscribers };
