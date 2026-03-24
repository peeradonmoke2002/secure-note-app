require('dotenv').config()
const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 3000
const SECRET_TOKEN = process.env.SECRET_TOKEN
const POCKETHOST_URL = process.env.POCKETHOST_URL
const POCKETHOST_USER_ID = parseInt(process.env.POCKETHOST_USER_ID) || 1
const POCKETHOST_TOKEN = process.env.POCKETHOST_TOKEN
const DB_FILE = path.join(__dirname, 'notes.json')

const USE_POCKETHOST = !!POCKETHOST_URL
const PH_ENDPOINT = USE_POCKETHOST
  ? `${POCKETHOST_URL}/api/collections/notes/records`
  : null

app.use(cors())
app.use(express.json())

// --- JSON file helpers ---
function loadNotes() {
  if (!fs.existsSync(DB_FILE)) return []
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'))
}
function saveNotes(notes) {
  fs.writeFileSync(DB_FILE, JSON.stringify(notes, null, 2))
}

// Middleware: check Authorization header
function requireAuth(req, res, next) {
  const token = req.headers['authorization']
  if (!token || token !== SECRET_TOKEN) {
    console.log(`[AUTH] 401 Unauthorized — ${req.method} ${req.path}`)
    return res.status(401).json({ error: 'Unauthorized' })
  }
  next()
}

// GET /api/notes
app.get('/api/notes', async (_req, res) => {
  try {
    let notes
    if (USE_POCKETHOST) {
      const response = await fetch(PH_ENDPOINT, {
        headers: { Authorization: `Bearer ${POCKETHOST_TOKEN}` },
      })
      const data = await response.json()
      notes = data.items.map((item) => ({ id: item.id, title: item.title, content: item.content }))
    } else {
      notes = loadNotes()
    }
    console.log(`[GET] /api/notes — returned ${notes.length} note(s) via ${USE_POCKETHOST ? 'PocketHost' : 'JSON file'}`)
    res.status(200).json(notes)
  } catch (err) {
    console.log('[GET] /api/notes — error:', err.message)
    res.status(500).json({ error: 'Failed to fetch notes' })
  }
})

// POST /api/notes
app.post('/api/notes', requireAuth, async (req, res) => {
  const { title, content } = req.body
  try {
    let note
    if (USE_POCKETHOST) {
      const response = await fetch(PH_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${POCKETHOST_TOKEN}` },
        body: JSON.stringify({ title, content, user_id: POCKETHOST_USER_ID }),
      })
      const item = await response.json()
      console.log('[POST] PocketHost raw response:', JSON.stringify(item))
      if (!response.ok) return res.status(response.status).json({ error: item.message || 'PocketHost error' })
      note = { id: item.id, title: item.title, content: item.content }
    } else {
      const notes = loadNotes()
      note = { id: Date.now(), title, content }
      notes.push(note)
      saveNotes(notes)
    }
    console.log(`[POST] /api/notes — created id=${note.id} title="${note.title}" via ${USE_POCKETHOST ? 'PocketHost' : 'JSON file'}`)
    res.status(201).json(note)
  } catch (err) {
    console.log('[POST] /api/notes — error:', err.message)
    res.status(500).json({ error: 'Failed to create note' })
  }
})

// DELETE /api/notes/:id
app.delete('/api/notes/:id', requireAuth, async (req, res) => {
  const { id } = req.params
  try {
    if (USE_POCKETHOST) {
      const response = await fetch(`${PH_ENDPOINT}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${POCKETHOST_TOKEN}` },
      })
      if (response.status === 404) {
        console.log(`[DELETE] /api/notes/${id} — 404 Not Found`)
        return res.status(404).json({ error: 'Note not found' })
      }
    } else {
      const notes = loadNotes()
      const index = notes.findIndex((n) => n.id === parseInt(id))
      if (index === -1) {
        console.log(`[DELETE] /api/notes/${id} — 404 Not Found`)
        return res.status(404).json({ error: 'Note not found' })
      }
      notes.splice(index, 1)
      saveNotes(notes)
    }
    console.log(`[DELETE] /api/notes/${id} — deleted via ${USE_POCKETHOST ? 'PocketHost' : 'JSON file'}`)
    res.status(200).json({ message: 'Note deleted' })
  } catch (err) {
    console.log(`[DELETE] /api/notes/${id} — error:`, err.message)
    res.status(500).json({ error: 'Failed to delete note' })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
  console.log(`SECRET_TOKEN loaded: ${SECRET_TOKEN ? 'yes' : 'NO — check your .env!'}`)
  console.log(`Storage mode: ${USE_POCKETHOST ? `PocketHost (${POCKETHOST_URL})` : `JSON file (${DB_FILE})`}`)
})
