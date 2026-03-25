import { useState } from 'react'
import { toast } from 'sonner'
import { useNotes } from '../data/useNotes'
import NoteForm from '../components/NoteForm'
import NoteDetail from '../components/NoteDetail'
import NoteList from '../components/NoteList'

export default function NotesPage() {
  const { notes, fetching, saving, error, addNote, removeNote } = useNotes()
  const [selectedNote, setSelectedNote] = useState(null)

  async function handleAdd(noteData) {
    try {
      await addNote(noteData)
      toast.success('Note added!')
    } catch {}
  }

  async function handleDelete(id) {
    try {
      await removeNote(id)
      if (selectedNote?.id === id) setSelectedNote(null)
      toast.error('Note deleted!')
    } catch {}
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 space-y-4">

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md px-4 py-3">
          {error}
        </div>
      )}

      <div className="flex gap-4 items-stretch">
        <NoteForm saving={saving} onAdd={handleAdd} />
        <NoteDetail note={selectedNote} onClose={() => setSelectedNote(null)} />
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Notes</h2>
        <NoteList
          notes={notes}
          fetching={fetching}
          selectedId={selectedNote?.id}
          onSelect={(note) => setSelectedNote(selectedNote?.id === note.id ? null : note)}
          onDelete={handleDelete}
        />
      </div>

    </main>
  )
}
