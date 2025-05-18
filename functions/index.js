// index.js
import { onRequest } from "firebase-functions/v2/https";
import * as corsLib from "cors";
import { sendEmail } from "./utils/mailService.js";

const cors = corsLib.default({ origin: true });

export const sendPayoutEmail = onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      const { to, subject, body } = req.body;

      if (!to?.trim() || !subject?.trim() || !body?.trim()) {
        return res.status(400).send("Missing or invalid email details");
      }

      console.log("Sending email to:", to);
      await sendEmail({ to, subject, body });

      res.status(200).send("Email sent successfully");
    } catch (err) {
      console.error("Email error:", err);
      res.status(500).send("Failed to send email");
    }
  });
});
