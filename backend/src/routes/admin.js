const express = require("express");
const { all, run } = require("../db");
const { requireStaff } = require("../middleware/auth");
const router = express.Router();

router.use(requireStaff);

router.get("/messages", async (req, res, next) => {
  try {
    const messages = await all(
      "SELECT id, name, email, subject, message, is_read, created_at FROM messages ORDER BY id DESC LIMIT 500"
    );
    res.json({ messages: messages.map((m) => ({ ...m, is_read: Boolean(m.is_read) })) });
  } catch (err) { next(err); }
});

router.post("/messages/:id/read", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isSafeInteger(id) || id < 1) return res.status(400).json({ error: "Invalid message ID." });
    const result = await run("UPDATE messages SET is_read = 1 WHERE id = ?", [id]);
    if (!result.changes) return res.status(404).json({ error: "Message not found." });
    res.json({ message: "Marked as read." });
  } catch (err) { next(err); }
});

router.post("/messages/:id/delete", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isSafeInteger(id) || id < 1) return res.status(400).json({ error: "Invalid message ID." });
    const result = await run("DELETE FROM messages WHERE id = ?", [id]);
    if (!result.changes) return res.status(404).json({ error: "Message not found." });
    res.json({ message: "Message deleted." });
  } catch (err) { next(err); }
});
module.exports = router;
