import { useState, useEffect } from 'react'
import { getNotes, createNote, deleteNote } from './api'

// Custom hook to manage notes state and API calls
export function useNotes() {
  // State management
  const [notes, setNotes] = useState([])
  const [fetching, setFetching] = useState(false)  // Loading when fetching initial notes
  const [saving, setSaving] = useState(false)      // Loading when creating/deleting
  const [error, setError] = useState(null)         // Error messages

  // Load all notes from backend
  async function fetchNotes() {
    setFetching(true)
    setError(null)

    try {
      const data = await getNotes()
      // Convert IDs to strings for consistency
      setNotes(data.map((note) => ({
        ...note,
        id: String(note.id),
      })))
    } catch (err) {
      setError('Failed to load notes. Is the backend running?')
    } finally {
      setFetching(false)
    }
  }

  // Add a new note
  async function addNote({ title, content }) {
    setSaving(true)
    setError(null)

    try {
      const newNote = await createNote({ title, content })
      // Add the new note to state
      setNotes((prev) => [
        ...prev,
        { ...newNote, id: String(newNote.id) },
      ])
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setSaving(false)
    }
  }

  // Delete a note
  async function removeNote(id) {
    setError(null)

    try {
      await deleteNote(id)
      // Remove the note from state
      setNotes((prev) => prev.filter((note) => note.id !== id))
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // Load notes when component mounts
  useEffect(() => {
    fetchNotes()
  }, [])

  return { notes, fetching, saving, error, addNote, removeNote }
}
