// mailService.js
import nodemailer from "nodemailer";

// Setup transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "gopeshgoyal26@gmail.com",
    pass: "hlrn xsmi uhjg hlyg", // App password
  },
});

// Reusable sendEmail function
export async function sendEmail({ to, subject, body }) {
  const mailOptions = {
    from: "gopeshgoyal26@gmail.com",
    to,
    subject: subject || "No subject",
    text: body || "No content",
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", result.response);
  } catch (err) {
    console.error("❌ Error sending email:", err);
    throw err;
  }
}
