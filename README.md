# School Website Starter

A four-person school website starter with:
- Plain HTML, CSS, and JavaScript frontend
- Node.js + Express backend
- SQLite contact-message storage
- Staff login with bcrypt password hashing and server-side sessions
- Protected admin inbox

## Requirements
- Node.js 20 or newer (LTS recommended)
- Git
- VS Code

## 1. Install backend dependencies
Open PowerShell in this repository:
```powershell
cd backend
Copy-Item .env.example .env
npm install
```

Edit `backend/.env` and set a long random `SESSION_SECRET`. Do not commit `.env`.

## 2. Create the first staff account
From the `backend` directory:
```powershell
npm run create-admin
```
Enter the staff email and a strong password when prompted. There is no default admin password.

## 3. Run the website
In the `backend` directory:
```powershell
npm run dev
```
Open http://localhost:3000

The Express server serves the frontend and the API. Contact messages are stored in a local SQLite database created automatically in `backend/data/`.

## Important security notes
- This is a learning starter, not a substitute for a security review before public launch.
- Keep `backend/.env` and `backend/data/` out of Git.
- Use HTTPS in production and set `NODE_ENV=production`.
- Set `COOKIE_SECURE=true` only when the deployed site is served over HTTPS.
- Do not store sensitive student records in this starter.
- Add backups, spam protection, and deployment-specific configuration before relying on it for official school communications.
- Only staff accounts created with `npm run create-admin` can sign in; never expose account creation publicly.

## Suggested team workflow
Use feature branches and pull requests. Agree on file ownership and API contracts before parallel edits. Never commit passwords, API keys, or real contact submissions.
