import { useState } from 'react'
import { POKEMON } from '../data/pokemon'
import DragonImg from '../assets/1aa6febd88204d4eb7ff8592ed65a6c0 1.png'

export default function NoteForm({ saving, onAdd, onClose }) {
  const [step, setStep] = useState(1) // 1: content, 2: pokemon selection, 3: confirm
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [selectedPokemon, setSelectedPokemon] = useState(null)

  async function handleStep2Submit() {
    setStep(2)
  }

  async function handlePokemonSelect(pokemon) {
    setSelectedPokemon(pokemon)
    setStep(3)
  }

  async function handleConfirm() {
    try {
      await onAdd({ title, content, pokemon: selectedPokemon })
      setTitle('')
      setContent('')
      setSelectedPokemon(null)
      setStep(1)
      onClose()
    } catch (err) {
      console.error('Error adding note:', err)
    }
  }

  function handleBack() {
    if (step === 2) setStep(1)
    else if (step === 3) setStep(2)
    else onClose()
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button onClick={handleBack} className="text-gray-400 hover:text-white text-2xl">
            ←
          </button>
          <div className="flex gap-3">
            {step === 1 && (
              <>
                <button onClick={onClose} className="text-gray-400 hover:text-red-400 text-2xl">
                  🗑️
                </button>
                <button onClick={handleStep2Submit} disabled={!title || !content} className="text-gray-400 hover:text-green-400 text-2xl disabled:opacity-50">
                  ✓
                </button>
              </>
            )}
          </div>
        </div>

        {/* Step 1: Content Input */}
        {step === 1 && (
          <div className="flex gap-6 items-start">
            <div className="flex-1 space-y-4">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                required
                className="input"
                autoFocus
              />
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter your note content..."
                required
                rows={6}
                className="input resize-none"
              />
            </div>
            <img
              src={DragonImg}
              alt="dragon"
              className="w-40 h-40 object-contain drop-shadow-lg"
            />
          </div>
        )}

        {/* Step 2: Pokemon Selection */}
        {step === 2 && (
          <div>
            <h2 className="text-white text-2xl font-light mb-2">
              Select Your <span className="font-bold">Pokèmon to note</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
              {POKEMON.map((pokemon) => (
                <button
                  key={pokemon.id}
                  onClick={() => handlePokemonSelect(pokemon)}
                  className="pokemon-btn relative h-40 rounded-xl overflow-hidden group"
                >
                  <img
                    src={pokemon.image}
                    alt={pokemon.name}
                    className="w-full h-full object-cover group-hover:brightness-110 transition-all"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-3">
                    <p className="text-white font-semibold text-sm">{pokemon.name}</p>
                    <p className="text-gray-300 text-xs">{pokemon.type}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <div className="text-center space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <img
                src={selectedPokemon.image}
                alt={selectedPokemon.name}
                className="w-32 h-32 object-cover mx-auto rounded-lg mb-4"
              />
              <h3 className="text-white text-xl font-bold">{selectedPokemon.name}</h3>
              <p className="text-gray-400 text-sm mt-2">{selectedPokemon.type} Type</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-4 text-left">
              <p className="text-gray-400 text-xs mb-2">TITLE</p>
              <p className="text-white font-semibold mb-4">{title}</p>
              <p className="text-gray-400 text-xs mb-2">CONTENT</p>
              <p className="text-gray-300 text-sm line-clamp-3">{content}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 px-6 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={saving}
                className="flex-1 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold transition-colors flex items-center justify-center gap-2"
              >
                {saving && (
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                )}
                {saving ? 'Saving...' : 'Okay'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
