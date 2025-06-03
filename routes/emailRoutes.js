// routes/emailRoutes.js
const express = require("express");
const router = express.Router();
const { sendEmail } = require("../utils/emailService");
const { generateEmail } = require("../utils/geminiService");

router.post("/send", async (req, res) => {
  const { name, age, location, language, email } = req.body;

  if (!email) return res.status(400).json({ error: "Recipient email is required." });

  try {
    const { subject, body } = await generateEmail({ name, age, location, language });
    const html = `<p>${body.replace(/\n/g, "<br>")}</p>`;

    const status = await sendEmail(email, subject, html);
    res.json({ status, subject, body });
  } catch (err) {
    console.error("❌ Email sending failed:", err.message);
    res.status(500).json({ error: "Failed to send personalized email." });
  }
});

module.exports = router;
