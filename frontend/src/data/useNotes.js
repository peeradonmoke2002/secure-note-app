import { useState, useEffect } from 'react'
import { getNotes, createNote, deleteNote } from './api'

export function useNotes() {
  const [notes, setNotes] = useState([])
  const [fetching, setFetching] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  async function fetchNotes() {
    setFetching(true)
    setError(null)
    try {
      const data = await getNotes()
      setNotes(data.map((n) => ({ ...n, id: String(n.id) })))
    } catch {
      setError('Failed to load notes. Is the backend running?')
    } finally {
      setFetching(false)
    }
  }

  async function addNote({ title, content }) {
    setSaving(true)
    setError(null)
    try {
      const note = await createNote({ title, content })
      setNotes((prev) => [...prev, { ...note, id: String(note.id) }])
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setSaving(false)
    }
  }

  async function removeNote(id) {
    setError(null)
    try {
      await deleteNote(id)
      setNotes((prev) => prev.filter((n) => n.id !== id))
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  useEffect(() => {
    fetchNotes()
  }, [])

  return { notes, fetching, saving, error, addNote, removeNote }
}
