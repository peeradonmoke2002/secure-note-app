# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SecureNote is a full-stack web application (course assignment) where authorized users can create, view, and delete text notes. Each note has a title and content. The app demonstrates client-server separation, HTTP protocols, and secure configuration via environment variables.

## Intended Project Structure

```
/SecureNote
  /backend
    .env              # PORT and SECRET_TOKEN (never commit)
    .gitignore        # must ignore .env
    server.js         # Node.js entry point
    package.json
  /frontend             # Vite + React + Tailwind CSS
    src/
      App.jsx
      main.jsx
      index.css       # Tailwind directives
    index.html
    vite.config.js
    tailwind.config.js
    postcss.config.js
    package.json
  REPORT.md           # conceptual report (required deliverable)
```

## Backend Setup & Commands

```bash
cd backend
npm install
node server.js        # or: npm start
```

Required `.env` (never commit):
```
PORT=3000
SECRET_TOKEN=your_secret_here
```

Install dependencies: `npm install express dotenv cors`

## Frontend Setup (first time only)

```bash
npm create vite@latest frontend -- --template react
cd frontend
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Add to `tailwind.config.js` content paths:
```js
content: ["./index.html", "./src/**/*.{js,jsx}"]
```

Add to `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Frontend Stack

React + Tailwind CSS, scaffolded with Vite.

```bash
cd frontend
npm install
npm run dev     # dev server at http://localhost:5173
npm run build   # production build
```

## API Endpoints

| Method | Path | Auth Required | Description |
|--------|------|---------------|-------------|
| GET | `/api/notes` | No | Returns all notes (JSON) |
| POST | `/api/notes` | Yes | Creates a note (`{ title, content }`) |
| DELETE | `/api/notes/:id` | Yes | Deletes a note by ID |

Authorization is via the `Authorization` header containing the `SECRET_TOKEN` value. Return `401 Unauthorized` when missing or wrong, `404 Not Found` when note doesn't exist.

## Key Implementation Requirements

- **CORS:** Enable CORS in Express — the browser will block frontend fetch requests otherwise.
- **Fetch API:** Frontend communicates with backend using `fetch()` with `async/await` (not callbacks). Watch for unhandled Promise pending states.
- **Auth header:** POST and DELETE must send `Authorization: <SECRET_TOKEN>` in request headers. The token is read from `process.env.SECRET_TOKEN` on the backend only — never expose it in frontend code.
- **HTTP status codes:** Use `200 OK`, `201 Created`, `401 Unauthorized`, `404 Not Found` appropriately.
- **Dynamic UI:** Use `useState` + `useEffect` to manage notes list and form state. Update state without page reloads; display user-friendly error messages when the backend returns errors.
- **Tailwind CSS:** Use Tailwind utility classes for all styling — no separate CSS files needed beyond the Tailwind directives in `index.css`.

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
| +15 | **PocketHost API:** Use the provided PocketHost API for persistence instead of local storage. Endpoints: `GET/POST /api/collections/notes/records`, `GET/PATCH/DELETE /api/collections/notes/records/:id` |
| +5  | **Loading State:** Show a loading indicator in the UI while waiting for a Fetch request to complete |

## Step-by-Step Implementation Guide

1. **Setup Backend:** Initialize a Node project. Install `express` and `dotenv`. Create the `.env` file.
2. **Create API:** Build the endpoints. Test with Bruno, Postman, or ThunderClient first to ensure logic works.
3. **Setup Frontend:** Create the UI (form to input notes + list to display them).
4. **Connect:** Use `fetch('http://localhost:YOUR_PORT/api/notes')` to connect frontend to backend.
5. **Secure:** Implement logic to send `SECRET_TOKEN` in the Fetch `Authorization` header.
6. **Document:** Write `REPORT.md`.

## Submission Guidelines

1. Upload code to a **public GitHub Repository**.
2. `README.md` must contain instructions on how to install dependencies and run both frontend and backend.
3. Submit the repository link via the learning portal.
4. **Warning:** If the `.env` file is visible in GitHub history (even if deleted later), you will lose all Security & Config points.

## Common Pitfalls

- **CORS Errors:** Always enable CORS in Express — the browser will block requests from a different port.
- **Hardcoded Secrets:** Never commit `.env`. Double-check git history to ensure it was never pushed.
- **Async/Await:** Watch for "Promise Pending" showing in the UI — means `await` was forgotten on a fetch call.
