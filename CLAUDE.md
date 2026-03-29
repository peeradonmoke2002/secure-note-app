# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SecureNote is a full-stack web application (course assignment) where authorized users can create, view, and delete text notes. Each note has a title and content. The app demonstrates client-server separation, HTTP protocols, and secure configuration via environment variables.

## Actual Project Structure

```
/SecureNote
  /backend
    .env              # PORT, SECRET_TOKEN, optional PocketHost vars (never commit)
    .gitignore        # ignores .env and node_modules
    server.js         # Node.js entry point (single file)
    notes.json        # local notes storage (auto-created, default mode)
    package.json
  /frontend             # Vite + React + Tailwind CSS
    src/
      components/
        NoteForm.jsx    # create note form (owns title/content state)
        NoteDetail.jsx  # selected note detail panel
        NoteList.jsx    # list of notes
      pages/
        NotesPage.jsx   # assembles components, holds selectedNote state
      data/
        api.js          # raw fetch functions (getNotes, createNote, deleteNote)
        useNotes.js     # custom hook — fetching/saving/notes/error state
      App.jsx           # layout + routes only
      main.jsx          # entry point with BrowserRouter + Toaster
      index.css         # Tailwind + @layer components custom classes
    index.html
    vite.config.js
    package.json
  README.md             # setup + run instructions (single file, root level)
  REPORT.md             # conceptual report (required deliverable)
```

## Backend Setup & Commands

```bash
cd backend
npm install
node server.js
```

Required `.env`:
```
PORT=3000
SECRET_TOKEN=your_secret_here
```

Optional PocketHost vars (add to `.env` to switch from local JSON to PocketHost):
```
POCKETHOST_URL=https://your-instance.pockethost.io
POCKETHOST_USER_ID=1
POCKETHOST_TOKEN=your_token
```

If `POCKETHOST_URL` is set → uses PocketHost API. Otherwise → uses local `notes.json`.

## Frontend Setup & Commands

```bash
cd frontend
npm install
npm run dev     # dev server at http://localhost:5173
npm run build   # production build
```

**Configuration:** No environment variables required. The API URL and SECRET_TOKEN are hardcoded in [src/data/api.js](frontend/src/data/api.js). They must match the backend's `.env` values.

## Frontend Stack

- React + Tailwind CSS, scaffolded with Vite
- **No Redux** — state managed via custom `useNotes()` hook
- Toast notifications via `sonner` (position: top-center)
- Custom Tailwind classes in `index.css`: `.card`, `.input`, `.btn-primary`, `.btn-danger`, `.note-item`
- `fetching` and `saving` are separate loading states (avoid double spinner)

## API Endpoints

| Method | Path | Auth Required | Description |
|--------|------|---------------|-------------|
| GET | `/api/notes` | No | Returns all notes (JSON) |
| POST | `/api/notes` | Yes | Creates a note (`{ title, content }`) |
| DELETE | `/api/notes/:id` | Yes | Deletes a note by ID |

Authorization is via the `Authorization` header containing the `SECRET_TOKEN` value. Returns `401 Unauthorized` when missing or wrong, `404 Not Found` when note doesn't exist.

## Key Implementation Notes

- **Single backend file:** Keep all backend logic in `server.js` — do not split into modules
- **Single README:** All docs in root `README.md` — no per-folder READMEs
- **No block comments** in server.js — use README for documentation
- **CORS:** Enabled in Express via `cors()` middleware
- **Auth header:** POST and DELETE send `Authorization: <SECRET_TOKEN>` in the header. The `SECRET_TOKEN` is defined in backend `.env` (the source of truth). Frontend reads it from `.env.local` or hardcodes it to send with requests.
- **HTTP status codes:** `200 OK`, `201 Created`, `401 Unauthorized`, `404 Not Found`

## Required Deliverable: REPORT.md

Must answer:
1. Where JS executes: Browser (V8 engine in browser runtime) vs. Node.js (V8 engine in Node runtime)
2. How the frontend updates the screen: DOM manipulation (Vanilla) or Virtual DOM (React)
3. HTTP/HTTPS request-response cycle when submitting a note, and why HTTPS matters in production
4. Why `SECRET_TOKEN` lives in backend `.env` and not in frontend code

## Evaluation Rubric (Total: 100 Points)

| Category | Criteria | Points |
|----------|----------|--------|
| Backend Functionality | Node.js server runs, API endpoints work correctly, CRUD operations functional | 25 |
| Security & Config | `.env` used correctly for secrets/port, `.env` excluded from Git, auth header implemented | 20 |
| Frontend Implementation | UI is responsive, Fetch API used correctly, DOM/State updates dynamically | 25 |
| HTTP Protocol | Correct usage of HTTP verbs (GET, POST, DELETE) and status codes | 15 |
| Conceptual Report | Clear, accurate explanation of JS Engine, Runtime, DOM, and Env Variables | 15 |
| Code Quality | Clean code, comments, proper folder structure, README instructions | 10 |

## Bonus Challenges (Optional)

| Points | Challenge |
|--------|-----------|
| +10 | **Cloud Deployment:** Deploy on a cloud host (Vercel, Netlify, etc.) with HTTPS and explain the process in REPORT.md |
| +10 | **Data Persistence:** Save notes to a `.json` file or a database (e.g., SQLite) so notes survive a server restart |
| +15 | **PocketHost API:** Use the provided PocketHost API for persistence instead of local storage |
| +5  | **Loading State:** Show a loading indicator in the UI while waiting for a Fetch request to complete |

## Submission Guidelines

1. Upload code to a **public GitHub Repository**.
2. `README.md` must contain instructions on how to install dependencies and run both frontend and backend.
3. Submit the repository link via the learning portal.
4. **Warning:** If the `.env` file is visible in GitHub history (even if deleted later), you will lose all Security & Config points.

## Common Pitfalls

- **CORS Errors:** Always enable CORS in Express — the browser will block requests from a different port.
- **Hardcoded Secrets:** Never commit `.env`. Double-check git history to ensure it was never pushed.
- **Async/Await:** Watch for "Promise Pending" showing in the UI — means `await` was forgotten on a fetch call.
