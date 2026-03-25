require('dotenv').config()
const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 3000
const SECRET_TOKEN = process.env.SECRET_TOKEN
const DB_FILE = path.join(__dirname, 'notes.json')

// PocketHost config (optional — set POCKETHOST_URL in .env to enable)
const PH_URL = process.env.POCKETHOST_URL
const PH_ENDPOINT = PH_URL ? `${PH_URL}/api/collections/notes/records` : null
const PH_TOKEN = process.env.POCKETHOST_TOKEN
const PH_USER_ID = parseInt(process.env.POCKETHOST_USER_ID) || 1

app.use(cors())
app.use(express.json())

// ─── Auth Middleware ───────────────────────────────────────────────────────────

function requireAuth(req, res, next) {
  if (req.headers['authorization'] !== SECRET_TOKEN)
    return res.status(401).json({ error: 'Unauthorized' })
  next()
}

// ─── Storage Helpers ───────────────────────────────────────────────────────────

function readFile() {
  if (!fs.existsSync(DB_FILE)) return []
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'))
}

function writeFile(notes) {
  fs.writeFileSync(DB_FILE, JSON.stringify(notes, null, 2))
}

async function getAllNotes() {
  if (PH_ENDPOINT) {
    const data = await fetch(PH_ENDPOINT, {
      headers: { Authorization: `Bearer ${PH_TOKEN}` },
    }).then((r) => r.json())
    return data.items.map(({ id, title, content }) => ({ id, title, content }))
  }
  return readFile()
}

async function createNote(title, content) {
  if (PH_ENDPOINT) {
    const r = await fetch(PH_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${PH_TOKEN}` },
      body: JSON.stringify({ title, content, user_id: PH_USER_ID }),
    })
    const item = await r.json()
    if (!r.ok) throw { status: r.status, message: item.message || 'PocketHost error' }
    return { id: item.id, title: item.title, content: item.content }
  }
  const notes = readFile()
  const note = { id: Date.now(), title, content }
  notes.push(note)
  writeFile(notes)
  return note
}

async function deleteNote(id) {
  if (PH_ENDPOINT) {
    const r = await fetch(`${PH_ENDPOINT}/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${PH_TOKEN}` },
    })
    if (r.status === 404) throw { status: 404, message: 'Note not found' }
    return
  }
  const notes = readFile()
  const index = notes.findIndex((n) => n.id === parseInt(id))
  if (index === -1) throw { status: 404, message: 'Note not found' }
  notes.splice(index, 1)
  writeFile(notes)
}

// ─── Routes ────────────────────────────────────────────────────────────────────

app.get('/api/notes', async (_req, res) => {
  try {
    const notes = await getAllNotes()
    res.json(notes)
  } catch {
    res.status(500).json({ error: 'Failed to fetch notes' })
  }
})

app.post('/api/notes', requireAuth, async (req, res) => {
  try {
    const note = await createNote(req.body.title, req.body.content)
    res.status(201).json(note)
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Failed to create note' })
  }
})

app.delete('/api/notes/:id', requireAuth, async (req, res) => {
  try {
    await deleteNote(req.params.id)
    res.json({ message: 'Note deleted' })
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Failed to delete note' })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
  console.log(`Storage: ${PH_ENDPOINT ? `PocketHost (${PH_URL})` : `JSON file (${DB_FILE})`}`)
})
