require("dotenv").config();
const readline = require("node:readline");
const bcrypt = require("bcryptjs");
const { initDb, get, run } = require("../src/db");

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}
async function main() {
  await initDb();
  const email = (await ask("Staff email: ")).trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    throw new Error("Please enter a valid email address.");
  }
  const password = await ask("New password (at least 12 characters): ");
  if (password.length < 12 || password.length > 200) {
    throw new Error("Password must be at least 12 characters and no more than 200.");
  }
  const existing = await get("SELECT id FROM staff WHERE email = ? COLLATE NOCASE", [email]);
  if (existing) throw new Error("That staff email already has an account.");
  const passwordHash = await bcrypt.hash(password, 12);
  await run("INSERT INTO staff (email, password_hash) VALUES (?, ?)", [email, passwordHash]);
  console.log("Staff account created. Keep the credentials private.");
}
main().catch((err) => {
  console.error(err.message);
  process.exitCode = 1;
}).finally(() => rl.close());
