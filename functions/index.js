import { onRequest } from "firebase-functions/v2/https";
import { sendEmail } from "./utils/mailService.js";

export const sendPayoutEmail = onRequest(async (req, res) => {
  try {
    const { to, subject, body } = req.body;

    if (!to || !subject || !body) {
      return res.status(400).send("Missing email details");
    }

    await sendEmail({ to, subject, body });

    res.status(200).send("Email sent successfully");
  } catch (err) {
    console.error("Email error:", err);
    res.status(500).send("Failed to send email");
  }
});
