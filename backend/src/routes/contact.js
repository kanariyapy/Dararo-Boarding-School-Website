const express = require("express");
const { run } = require("../db");
const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const { name, email, subject, message, website } = req.body || {};
    // Honeypot: automated bots often fill hidden fields. Respond successfully without storing.
    if (typeof website === "string" && website.trim()) {
      return res.status(200).json({ message: "Message received." });
    }
    const clean = {
      name: typeof name === "string" ? name.trim() : "",
      email: typeof email === "string" ? email.trim().toLowerCase() : "",
      subject: typeof subject === "string" ? subject.trim() : "",
      message: typeof message === "string" ? message.trim() : ""
    };
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (clean.name.length < 2 || clean.name.length > 100) {
      return res.status(400).json({ error: "Name must be between 2 and 100 characters." });
    }
    if (clean.email.length > 254 || !emailPattern.test(clean.email)) {
      return res.status(400).json({ error: "Enter a valid email address." });
    }
    if (clean.subject.length < 2 || clean.subject.length > 150) {
      return res.status(400).json({ error: "Subject must be between 2 and 150 characters." });
    }
    if (clean.message.length < 10 || clean.message.length > 5000) {
      return res.status(400).json({ error: "Message must be between 10 and 5000 characters." });
    }
    await run(
      "INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)",
      [clean.name, clean.email, clean.subject, clean.message]
    );
    res.status(201).json({ message: "Message received." });
  } catch (err) { next(err); }
});
module.exports = router;
