const express = require("express");
const bcrypt = require("bcryptjs");
const { get } = require("../db");
const router = express.Router();

router.post("/login", async (req, res, next) => {
  try {
    const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const password = typeof req.body?.password === "string" ? req.body.password : "";
    if (!email || !password || email.length > 254 || password.length > 200) {
      return res.status(400).json({ error: "Enter your email and password." });
    }
    const staff = await get("SELECT id, email, password_hash FROM staff WHERE email = ? COLLATE NOCASE", [email]);
    const passwordMatches = staff ? await bcrypt.compare(password, staff.password_hash) : false;
    if (!staff || !passwordMatches) {
      return res.status(401).json({ error: "Invalid email or password." });
    }
    req.session.regenerate((err) => {
      if (err) return next(err);
      req.session.staffId = staff.id;
      req.session.staffEmail = staff.email;
      req.session.save((saveErr) => {
        if (saveErr) return next(saveErr);
        res.json({ message: "Signed in." });
      });
    });
  } catch (err) { next(err); }
});

router.post("/logout", (req, res, next) => {
  if (!req.session) return res.json({ message: "Signed out." });
  req.session.destroy((err) => {
    if (err) return next(err);
    res.clearCookie("school.sid", { path: "/" });
    res.json({ message: "Signed out." });
  });
});

router.get("/me", (req, res) => {
  if (!req.session?.staffId) return res.status(401).json({ error: "Not signed in." });
  res.json({ email: req.session.staffEmail });
});
module.exports = router;
