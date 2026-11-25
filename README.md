# Healthcare Symptom Checker

React (Vite) + Node/Express rule-based symptom checker with login. Data is stored in MongoDB (`users` and `checks` collections) using Mongoose. Install MongoDB locally (or use Atlas) and set `MONGO_URI` in `backend/.env`.

## Run
Terminal 1:

    cd backend
    npm install
    npm run dev        (http://localhost:5000)

Terminal 2:

    cd frontend
    npm install
    npm run dev        (http://localhost:5173)

Open http://localhost:5173, register an account and run a check.

## API
| Method | Route | Purpose |
|---|---|---|
| POST | /api/auth/register | Create account |
| POST | /api/auth/login | Log in, returns JWT |
| GET | /api/symptoms | Symptom list grouped by body area |
| POST | /api/check | Run rule engine, save result |
| GET | /api/history | Your past checks |
| DELETE | /api/history/:id | Delete one check |
| DELETE | /api/history | Clear all your checks |

All routes except `/api/auth/*` need `Authorization: Bearer <token>`. Passwords are hashed with bcrypt. Each user only sees their own history.

Rules live in `backend/data/rules.json`. Red flags (chest pain, shortness of breath, confusion, or high fever with severe severity) always return "emergency".

## Deploy (Atlas + Render + Vercel)
1. **Atlas**: free M0 cluster, DB user, Network Access `0.0.0.0/0`, copy connection string with `/symptom-checker` DB name.
2. **Render** (Web Service): Root Directory `backend`, Build `npm install`, Start `npm start`, env `MONGO_URI`, `JWT_SECRET`. Check `/api/health`.
3. **Vercel**: Root Directory `frontend`, env `VITE_API_URL=https://<render-app>.onrender.com/api`.

## Push to GitHub
```
git init
git add .
git commit -m "Healthcare Symptom Checker"
git branch -M main
git remote add origin https://github.com/sirii49/Symptom_Checker.git
git push -u origin main --force
```
