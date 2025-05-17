// index.js
import { onRequest } from "firebase-functions/v2/https";
import nodemailer from "nodemailer";
// Setup transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your-email@gmail.com",
    pass: "your-app-password", // App password, not your Gmail login
  },
});

// Cloud Function to send email
export const sendEmail = onRequest(async (req, res) => {
  const { to, subject, message } = req.body;

  const mailOptions = {
    from: "your-email@gmail.com",
    to: to || "recipient@example.com",
    subject: subject || "Default Subject",
    text: message || "Default message body.",
  };

  try {
    await transporter.sendMail(mailOptions);
    res.send("✅ Email sent successfully!");
  } catch (error) {
    console.error("❌ Error sending email:", error);
    res.status(500).send("Failed to send email");
  }
});
