# SecureNote

A full-stack web application for creating, viewing, and deleting secure notes with client-server separation and environment-based configuration.

**Stack:** Node.js + Express | React + Vite | Tailwind CSS


![SecureNote Screenshot](/images/front-end.png)

## Table of Contents

- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Backend](#backend)
- [Frontend](#frontend)
- [API Endpoints](#api-endpoints)

---

## Project Structure

```
/SecureNote
  /backend          # Node.js + Express server
  /frontend         # React + Vite + Tailwind CSS
  REPORT.md         # Conceptual documentation (required deliverable)
  README.md         # This file
```

---

## Quick Start

### Terminal 1: Backend
```bash
cd backend
npm install
# Create .env file (see Backend section)
node server.js
```

### Terminal 2: Frontend
```bash
cd frontend
npm install
# Create .env.local file (see Frontend section)
npm run dev
```

Then open `http://localhost:5173` in your browser.

---

## Backend

### Setup

**Prerequisites:**
- Node.js (v14+)
- npm

**Installation:**
```bash
cd backend
npm install
```

**Configuration:**

Create a `.env` file:
```env
PORT=3000
SECRET_TOKEN=your_secret_here
```

**Storage Mode:**
- **Default:** Local JSON file (`notes.json`)
- **Optional:** PocketHost API

To use PocketHost, add to `.env`:
```env
POCKETHOST_URL=https://your-pockethost-instance.io
POCKETHOST_USER_ID=1
POCKETHOST_TOKEN=your_pockethost_token
```

If `POCKETHOST_URL` is set → uses PocketHost. Otherwise → uses local `notes.json`. No code changes needed.

**Run:**
```bash
node server.js
```

Server will start on `http://localhost:3000`

### Architecture

```
backend/
  server.js         # Main Express app, routes, middleware
  notes.json        # Local notes storage (auto-created)
  .env              # Environment variables (not committed)
  package.json
```

**Key Features:**
- Single entry point: `server.js`
- Auto-detects storage mode from `.env` (local JSON or PocketHost)
- `requireAuth` middleware for POST/DELETE endpoints
- CORS enabled for frontend requests

---

## Frontend

### Setup

**Prerequisites:**
- Node.js (v14+)
- npm

**Installation:**
```bash
cd frontend
npm install
```

**Configuration:**

Create a `.env.local` file:
```env
VITE_API_URL=http://localhost:3000
VITE_SECRET_TOKEN=your_secret_here
```

These should match the backend's `SECRET_TOKEN` and port.

**Development:**
```bash
npm run dev
```

Frontend will start on `http://localhost:5173`

**Production Build:**
```bash
npm run build
```

### Architecture

```
src/
  components/           # Reusable UI components
    NoteForm.jsx       # Form to create notes
    NoteDetail.jsx     # Panel to view selected note
    NoteList.jsx       # List of all notes
  pages/
    NotesPage.jsx      # Main page (assembles components)
  data/
    api.js             # Fetch functions for backend API
    useNotes.js        # Custom hook for state management
  App.jsx              # Router + layout
  main.jsx             # Entry point
  index.css            # Tailwind + custom classes
```

**State Management:**

Custom `useNotes()` hook (no Redux):
- `fetching` — initial load state
- `saving` — create/delete state
- `notes` — array of note objects
- `error` — error message

---

## API Endpoints

| Method | Path | Auth Required | Description |
|--------|------|---------------|-------------|
| GET | `/api/notes` | No | Returns all notes |
| POST | `/api/notes` | Yes | Creates a new note: `{ title, content }` |
| DELETE | `/api/notes/:id` | Yes | Deletes a note by ID |

**Authorization:** Include `SECRET_TOKEN` in the `Authorization` header for POST and DELETE requests.

Example:
```bash
curl -X POST http://localhost:3000/api/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: your_secret_here" \
  -d '{"title":"My Note","content":"Note content"}'
```
