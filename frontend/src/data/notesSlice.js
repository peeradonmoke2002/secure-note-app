import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const TOKEN = import.meta.env.VITE_SECRET_TOKEN
const ENDPOINT = `${API_BASE}/api/notes`

// Async thunks
export const fetchNotes = createAsyncThunk('notes/fetchAll', async () => {
  console.log('[GET] /api/notes — fetching notes from:', ENDPOINT)
  const res = await fetch(ENDPOINT)
  console.log('[GET] /api/notes — response status:', res.status)
  if (!res.ok) throw new Error('Failed to fetch notes')
  return res.json()
})

export const addNote = createAsyncThunk('notes/add', async ({ title, content }) => {
  console.log('[POST] /api/notes — sending Authorization header:', TOKEN ? 'token set' : 'NO TOKEN')
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: TOKEN,
    },
    body: JSON.stringify({ title, content }),
  })
  console.log('[POST] /api/notes — response status:', res.status)
  if (res.status === 401) throw new Error('Unauthorized')
  if (!res.ok) throw new Error('Failed to create note')
  return res.json()
})

export const removeNote = createAsyncThunk('notes/remove', async (id) => {
  id = String(id)
  console.log(`[DELETE] /api/notes/${id} — sending Authorization header:`, TOKEN ? 'token set' : 'NO TOKEN')
  const res = await fetch(`${ENDPOINT}/${id}`, {
    method: 'DELETE',
    headers: { Authorization: TOKEN },
  })
  console.log(`[DELETE] /api/notes/${id} — response status:`, res.status)
  if (res.status === 401) throw new Error('Unauthorized')
  if (res.status === 404) throw new Error('Note not found')
  if (!res.ok) throw new Error('Failed to delete note')
  return id
})

// Slice
const notesSlice = createSlice({
  name: 'notes',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchNotes
      .addCase(fetchNotes.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.loading = false
        // normalize ids to string to handle both JSON file (number) and PocketHost (string)
        state.items = action.payload.map((n) => ({ ...n, id: String(n.id) }))
      })
      .addCase(fetchNotes.rejected, (state) => {
        state.loading = false
        state.error = 'Failed to load notes. Is the backend running?'
      })
      // addNote
      .addCase(addNote.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addNote.fulfilled, (state, action) => {
        state.loading = false
        state.items.push({ ...action.payload, id: String(action.payload.id) })
      })
      .addCase(addNote.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      // removeNote
      .addCase(removeNote.fulfilled, (state, action) => {
        state.items = state.items.filter((n) => n.id !== action.payload)
      })
      .addCase(removeNote.rejected, (state, action) => {
        state.error = action.error.message
      })
  },
})

export default notesSlice.reducer
