# ProtestWatch App

[Live Demo on Vercel](https://protest-watch-app.vercel.app/)

A full-stack, real-time protest monitoring platform built with React (Vite), Express.js, and Neon/Postgres.

---

## Features
- Modern, responsive UI (React + Tailwind CSS)
- Real-time event and opinion tracking
- Express.js backend API
- Neon/Postgres database integration
- API endpoints for submitting and retrieving opinions
- Deployed on Vercel

---

## Live Demo
👉 [https://protest-watch-app.vercel.app/](https://protest-watch-app.vercel.app/)

---

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/GibsonWaheire/ProtestWatch_App.git
cd ProtestWatch_App
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the frontend (React)
```bash
npm run dev
```

### 4. Backend Setup
- Go to the `backend/` folder:
  ```bash
  cd backend
  npm install
  ```
- Create a `.env` file in `backend/` with your Neon/Postgres connection string:
  ```env
  DATABASE_URL=your_neon_connection_string
  ```
- Start the backend server:
  ```bash
  npm run dev
  ```

### 5. Database Setup
- In your Neon Console, run:
  ```sql
  CREATE TABLE IF NOT EXISTS opinions (
    id SERIAL PRIMARY KEY,
    event_id TEXT NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );
  ```

---

## API Endpoints
- `GET /api/opinions/:eventId` — Get all opinions for an event
- `POST /api/opinions` — Add a new opinion (JSON: `{ event_id, comment }`)

---

## Team
- **Dashboard:** Gibson Waheire
- **Events:** Martin Muthaura
- **Reports:** Debra Wachira
-              Clinton Mwangi

---

## License
MIT
