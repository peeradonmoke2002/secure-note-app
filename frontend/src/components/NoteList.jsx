export default function NoteList({ notes, fetching, onSelect, onDelete }) {
  if (fetching && notes.length === 0) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <svg className="animate-spin h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
        </svg>
        Loading notes...
      </div>
    )
  }

  if (notes.length === 0) {
    return <p className="text-sm text-gray-400">No notes yet.</p>
  }

  return (
    <ul className="space-y-3 max-h-64 sm:max-h-80 lg:max-h-96 overflow-y-auto">
      {notes.map((note) => (
        <li key={note.id} onClick={() => onSelect(note)} className="note-item">
          <div className="min-w-0">
            <p className="font-medium text-gray-800">{note.title}</p>
            <p className="text-sm text-gray-500 mt-1 break-all line-clamp-3">{note.content}</p>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(note.id) }}
            className="btn-danger"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  )
}
