const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const TOKEN = import.meta.env.VITE_SECRET_TOKEN
const ENDPOINT = `${API_BASE}/api/notes`

export async function getNotes() {
  const res = await fetch(ENDPOINT)
  if (!res.ok) throw new Error('Failed to fetch notes')
  return res.json()
}

export async function createNote({ title, content }) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: TOKEN,
    },
    body: JSON.stringify({ title, content }),
  })
  if (res.status === 401) throw new Error('Unauthorized')
  if (!res.ok) throw new Error('Failed to create note')
  return res.json()
}

export async function deleteNote(id) {
  const res = await fetch(`${ENDPOINT}/${id}`, {
    method: 'DELETE',
    headers: { Authorization: TOKEN },
  })
  if (res.status === 401) throw new Error('Unauthorized')
  if (res.status === 404) throw new Error('Note not found')
  if (!res.ok) throw new Error('Failed to delete note')
}
