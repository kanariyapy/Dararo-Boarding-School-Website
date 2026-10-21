function requireStaff(req, res, next) {
  if (!req.session || !req.session.staffId) {
    return res.status(401).json({ error: "Please sign in to access the staff inbox." });
  }
  next();
}
module.exports = { requireStaff };
