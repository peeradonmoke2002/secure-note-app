import NotesPage from './pages/NotesPage'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-3 sm:px-6 sm:py-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">SecureNote</h1>
      </header>
      <NotesPage />
    </div>
  )
}
