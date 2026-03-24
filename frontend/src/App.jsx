import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { fetchNotes, addNote, removeNote } from './data/notesSlice'

function NotesPage() {
  const dispatch = useDispatch()
  const { items: notes, loading, error } = useSelector((state) => state.notes)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [selectedNote, setSelectedNote] = useState(null)
  const [toast, setToast] = useState(null)

  function showToast(msg, type = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 2500)
  }

  useEffect(() => {
    dispatch(fetchNotes())
  }, [dispatch])

  async function handleCreate(e) {
    e.preventDefault()
    const result = await dispatch(addNote({ title, content }))
    if (result.meta.requestStatus === 'fulfilled') {
      setTitle('')
      setContent('')
      showToast('Note added!')
    }
  }

  async function handleDelete(id) {
    const result = await dispatch(removeNote(id))
    if (result.meta.requestStatus === 'fulfilled') {
      dispatch(fetchNotes())
      if (selectedNote?.id === id) setSelectedNote(null)
      showToast('Note deleted!', 'danger')
    }
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 space-y-4">

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md px-4 py-3">
          {error}
        </div>
      )}

      {/* Top row: New Note form + Note Detail side by side */}
      <div className="flex gap-4 items-stretch">
        {/* Create Note Form */}
        <div className="bg-white rounded-lg border border-gray-200 p-5 w-80 shrink-0">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">New Note</h2>
          <form onSubmit={handleCreate} className="space-y-3">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Content"
              required
              rows={4}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2 rounded-md text-sm transition-colors flex items-center justify-center gap-2"
            >
              {loading && (
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
              )}
              {loading ? 'Saving...' : 'Add Note'}
            </button>
          </form>
        </div>

        {/* Note Detail Block */}
        {selectedNote ? (
          <div className="bg-white rounded-lg border border-blue-200 p-5 flex-1 min-w-0 space-y-3">
            <div className="flex justify-between items-start gap-4">
              <h2 className="text-lg font-semibold text-gray-800">{selectedNote.title}</h2>
              <button
                onClick={() => setSelectedNote(null)}
                className="text-gray-400 hover:text-gray-600 text-sm shrink-0"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-gray-600 whitespace-pre-wrap break-all max-h-64 overflow-y-auto">
              {selectedNote.content}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-5 flex-1 min-w-0 flex flex-col items-center justify-center text-center gap-2">
            <p className="text-gray-400 text-sm">Select a note to read</p>
            <p className="text-gray-300 text-xs">Click any note from the list below</p>
          </div>
        )}
      </div>

      {/* Notes List */}
      <div>
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Notes</h2>
        {loading && notes.length === 0 ? (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <svg className="animate-spin h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            Loading notes...
          </div>
        ) : notes.length === 0 ? (
          <p className="text-sm text-gray-400">No notes yet.</p>
        ) : (
          <ul className="space-y-3">
            {notes.map((note) => (
              <li
                key={note.id}
                onClick={() => setSelectedNote(selectedNote?.id === note.id ? null : note)}
                className="bg-white rounded-lg border border-gray-200 p-4 flex justify-between items-start gap-4 cursor-pointer hover:border-blue-300 hover:shadow-sm transition-all"
              >
                <div className="min-w-0">
                  <p className="font-medium text-gray-800">{note.title}</p>
                  <p className="text-sm text-gray-500 mt-1 break-all line-clamp-3">{note.content}</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(note.id) }}
                  className="text-red-500 hover:text-red-700 text-sm shrink-0"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 text-white text-sm font-medium px-5 py-2.5 rounded-full shadow-lg transition-opacity ${toast.type === 'danger' ? 'bg-red-500' : 'bg-green-600'}`}>
          {toast.msg}
        </div>
      )}

    </main>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-800">SecureNote</h1>
      </header>

      <Routes>
        <Route path="/" element={<NotesPage />} />
      </Routes>
    </div>
  )
}
