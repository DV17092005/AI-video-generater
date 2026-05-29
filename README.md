# AI Video Generator

This repository contains a full-stack AI Video Generator application with separate frontend and backend directories.

## Project structure

- `frontend/` - React + Vite user interface
- `backend/` - Express API server with MongoDB and WebSocket support

## Setup

### Frontend

1. Open a terminal in the repository root.
2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```
4. Open the local URL shown in the terminal (default is usually `http://localhost:5173`).

### Backend

1. Open a terminal in the repository root.
2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Copy `.env.example` to `.env` and update values if needed:
   ```bash
   cp .env.example .env
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```
5. The backend should start on `http://localhost:5000` by default.

## Notes

- The backend connects to MongoDB using `MONGO_URI` from the `.env` file.
- The frontend is configured with Vite and loads from `frontend/index.html`.
- The backend includes socket support via `backend/sockets/socketServer.js`.

## Quick start

```bash
cd frontend && npm install
cd ../backend && npm install
cd ../frontend && npm run dev
cd ../backend && npm run dev
```
