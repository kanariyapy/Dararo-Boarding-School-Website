require("dotenv").config();
const path = require("node:path");
const fs = require("node:fs");
const express = require("express");
const session = require("express-session");
const SQLiteStore = require("connect-sqlite3")(session);
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { initDb } = require("./db");
const contactRoutes = require("./routes/contact");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");

const app = express();
const port = Number(process.env.PORT || 3000);
const isProduction = process.env.NODE_ENV === "production";
const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret || sessionSecret.length < 32 || sessionSecret === "replace-this-with-a-long-random-secret") {
  console.error("Set SESSION_SECRET to a unique random value of at least 32 characters in backend/.env.");
  process.exit(1);
}
if (isProduction && process.env.COOKIE_SECURE !== "true") {
  console.error("In production, set COOKIE_SECURE=true and serve the site over HTTPS.");
  process.exit(1);
}

const dataDir = path.join(__dirname, "..", "data");
fs.mkdirSync(dataDir, { recursive: true });

app.disable("x-powered-by");
if (isProduction) app.set("trust proxy", 1);
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'"],
      objectSrc: ["'none'"],
      frameAncestors: ["'none'"],
      upgradeInsecureRequests: isProduction ? [] : null
    }
  }
}));
app.use(express.json({ limit: "20kb" }));

app.use(session({
  name: "school.sid",
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  store: new SQLiteStore({
    db: "sessions.sqlite",
    dir: dataDir,
    concurrentDB: true
  }),
  cookie: {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === "true",
    sameSite: "strict",
    maxAge: Math.max(1, Number(process.env.SESSION_MAX_AGE_HOURS || 8)) * 60 * 60 * 1000
  }
}));

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many sign-in attempts. Please wait and try again." }
});
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many messages from this connection. Please try again later." }
});

app.use("/api/contact", contactLimiter, contactRoutes);
app.use("/api/auth/login", loginLimiter);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

const frontendDir = path.join(__dirname, "..", "..", "frontend");
app.use(express.static(frontendDir, { extensions: ["html"] }));

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use((err, _req, res, _next) => {
  console.error("Request failed:", err.message);
  res.status(500).json({ error: "An unexpected server error occurred." });
});

initDb().then(() => {
  app.listen(port, () => console.log(`School website running at http://localhost:${port}`));
}).catch((err) => {
  console.error("Could not initialize database:", err);
  process.exit(1);
});
