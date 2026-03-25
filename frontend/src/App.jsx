import { Routes, Route } from 'react-router-dom'
import NotesPage from './pages/NotesPage'

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
