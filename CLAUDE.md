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
