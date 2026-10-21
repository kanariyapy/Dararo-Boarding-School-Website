# Dararo Boarding School Website

A website for Dararo Boarding School, built collaboratively by four students.

## Project Features

- Plain HTML, CSS, and JavaScript frontend
- Node.js and Express backend
- SQLite storage for contact messages
- Staff login with bcrypt password hashing and server-side sessions
- Protected admin inbox for viewing submitted contact messages

## Requirements

- Node.js 20 or newer (LTS recommended)
- Git
- Visual Studio Code

## 1. Install Backend Dependencies

Open PowerShell in the project repository:

```powershell
cd backend
Copy-Item .env.example .env
npm install
```

Edit `backend/.env` and set a long, random `SESSION_SECRET`. Never commit your `.env` file.

## 2. Create the First Staff Account

From the `backend` directory, run:

```powershell
npm run create-admin
```

Enter the staff email and a strong password when prompted. There is no default admin password.

## 3. Run the Website

From the `backend` directory, run:

```powershell
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The Express server serves the frontend and API. Contact messages are stored in a local SQLite database created automatically in `backend/data/`.

## Security Notes

- This is a learning starter, not a substitute for a security review before public launch.
- Keep `backend/.env` and `backend/data/` out of Git.
- Use HTTPS in production and set `NODE_ENV=production`.
- Set `COOKIE_SECURE=true` only when the deployed site uses HTTPS.
- Do not store sensitive student records in this starter.
- Add backups, spam protection, and deployment-specific configuration before relying on it for official school communications.
- Only staff accounts created with `npm run create-admin` can sign in. Never expose account creation publicly.

## Team Workflow

Use feature branches and pull requests. Agree on file ownership and API contracts before working on the same files. Never commit passwords, API keys, or real contact submissions.
