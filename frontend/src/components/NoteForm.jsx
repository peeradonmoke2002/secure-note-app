import { useState } from 'react'

export default function NoteForm({ saving, onAdd }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    await onAdd({ title, content })
    setTitle('')
    setContent('')
  }

  return (
    <div className="card w-full lg:w-80 lg:shrink-0">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">New Note</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
          className="input"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
          required
          rows={4}
          className="input resize-none"
        />
        <button type="submit" disabled={saving} className="btn-primary">
          {saving && (
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
          )}
          {saving ? 'Saving...' : 'Add Note'}
        </button>
      </form>
    </div>
  )
}
