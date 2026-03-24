import { useState, useEffect } from 'react'

const API = 'http://localhost:3000/api/notes'
const TOKEN = '' // set this to match SECRET_TOKEN in backend/.env

export default function App() {
  const [notes, setNotes] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedNote, setSelectedNote] = useState(null)

  useEffect(() => {
    // TODO: replace with fetchNotes() once backend is ready
    setNotes([
      { id: 1, title: 'First Note', content: 'This is a mock note for UI testing.' },
      { id: 2, title: 'Second Note', content: 'Backend not connected yet.' },
    ])
  }, [])

  async function handleCreate(e) {
    e.preventDefault()
    setError('')
    // TODO: replace with real fetch once backend is ready
    const newNote = { id: Date.now(), title, content }
    setNotes([...notes, newNote])
    setTitle('')
    setContent('')
  }

  async function handleDelete(id) {
    setError('')
    // TODO: replace with real fetch once backend is ready
    setNotes(notes.filter((n) => n.id !== id))
    if (selectedNote?.id === id) setSelectedNote(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-800">SecureNote</h1>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">

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
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2 rounded-md text-sm transition-colors"
              >
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

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md px-4 py-3">
            {error}
          </div>
        )}

        {/* Notes List */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Notes</h2>
          {loading && notes.length === 0 ? (
            <p className="text-sm text-gray-400">Loading...</p>
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


      </main>
    </div>
  )
}
