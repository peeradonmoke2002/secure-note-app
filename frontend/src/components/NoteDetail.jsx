export default function NoteDetail({ note, onClose }) {
  if (!note) {
    return (
      <div className="card flex-1 min-w-0 flex flex-col items-center justify-center text-center gap-2">
        <p className="text-gray-400 text-sm">Select a note to read</p>
        <p className="text-gray-300 text-xs">Click any note from the list below</p>
      </div>
    )
  }

  return (
    <div className="card flex-1 min-w-0 space-y-3 border-blue-200">
      <div className="flex justify-between items-start gap-4">
        <h2 className="text-lg font-semibold text-gray-800">{note.title}</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-sm shrink-0">
          ✕
        </button>
      </div>
      <p className="text-sm text-gray-600 whitespace-pre-wrap break-all max-h-64 overflow-y-auto">
        {note.content}
      </p>
    </div>
  )
}
