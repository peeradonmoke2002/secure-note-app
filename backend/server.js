require('dotenv').config()
const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 3000
const SECRET_TOKEN = process.env.SECRET_TOKEN
const DB_FILE = path.join(__dirname, 'notes.json')

// PocketHost config (optional)
const PH_URL = process.env.POCKETHOST_URL
const PH_ENDPOINT = PH_URL ? `${PH_URL}/api/collections/notes/records` : null
const PH_TOKEN = process.env.POCKETHOST_TOKEN
const PH_USER_ID = parseInt(process.env.POCKETHOST_USER_ID) || 1

app.use(cors())
app.use(express.json())

// --- Local JSON file helpers ---
function loadNotes() {
  if (!fs.existsSync(DB_FILE)) return []
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'))
}
function saveNotes(notes) {
  fs.writeFileSync(DB_FILE, JSON.stringify(notes, null, 2))
}

// --- Auth middleware ---
function requireAuth(req, res, next) {
  if (req.headers['authorization'] !== SECRET_TOKEN)
    return res.status(401).json({ error: 'Unauthorized' })
  next()
}

// GET /api/notes
app.get('/api/notes', async (_req, res) => {
  try {
    let notes
    if (PH_ENDPOINT) {
      const data = await fetch(PH_ENDPOINT, { headers: { Authorization: `Bearer ${PH_TOKEN}` } }).then(r => r.json())
      notes = data.items.map(({ id, title, content }) => ({ id, title, content }))
    } else {
      notes = loadNotes()
    }
    res.json(notes)
  } catch {
    res.status(500).json({ error: 'Failed to fetch notes' })
  }
})

// POST /api/notes
app.post('/api/notes', requireAuth, async (req, res) => {
  const { title, content } = req.body
  try {
    let note
    if (PH_ENDPOINT) {
      const r = await fetch(PH_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${PH_TOKEN}` },
        body: JSON.stringify({ title, content, user_id: PH_USER_ID }),
      })
      const item = await r.json()
      if (!r.ok) return res.status(r.status).json({ error: item.message || 'PocketHost error' })
      note = { id: item.id, title: item.title, content: item.content }
    } else {
      note = { id: Date.now(), title, content }
      const notes = loadNotes()
      notes.push(note)
      saveNotes(notes)
    }
    res.status(201).json(note)
  } catch {
    res.status(500).json({ error: 'Failed to create note' })
  }
})

// DELETE /api/notes/:id
app.delete('/api/notes/:id', requireAuth, async (req, res) => {
  const { id } = req.params
  try {
    if (PH_ENDPOINT) {
      const r = await fetch(`${PH_ENDPOINT}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${PH_TOKEN}` },
      })
      if (r.status === 404) return res.status(404).json({ error: 'Note not found' })
    } else {
      const notes = loadNotes()
      const index = notes.findIndex((n) => n.id === parseInt(id))
      if (index === -1) return res.status(404).json({ error: 'Note not found' })
      notes.splice(index, 1)
      saveNotes(notes)
    }
    res.json({ message: 'Note deleted' })
  } catch {
    res.status(500).json({ error: 'Failed to delete note' })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
  console.log(`Storage: ${PH_ENDPOINT ? `PocketHost (${PH_URL})` : `JSON file (${DB_FILE})`}`)
})
