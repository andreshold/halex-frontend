import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send } from 'lucide-react'

export default function ChipsClarification({ message, onChoix, desactive }) {
  const [saisie, setSaisie] = useState('')

  function choisir(option) {
    if (desactive) return
    onChoix({ texte: option, contexte: message.contexte_clarification })
  }

  function validerSaisieLibre() {
    if (desactive) return
    const texte = saisie.trim()
    if (!texte) return
    onChoix({ texte, contexte: null })
    setSaisie('')
  }

  return (
    <div>
      <p className="mb-2.5 whitespace-pre-wrap text-sm leading-relaxed text-navy-800 sm:text-[15px]">
        {message.content}
      </p>
      <div className="flex flex-wrap gap-2">
        {message.options?.map((option, i) => (
          <motion.button
            key={i}
            type="button"
            whileHover={{ scale: 1.03, borderColor: 'rgba(212,175,55,0.5)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => choisir(option)}
            className={`rounded-full border border-navy-900/10 bg-white px-4 py-2 text-left text-xs text-navy-700 shadow-sm transition-shadow hover:border-gold-400/50 hover:shadow-md ${
              desactive ? 'pointer-events-none opacity-50' : ''
            }`}
          >
            {option}
          </motion.button>
        ))}
      </div>

      {message.autre_autorise && (
        <div className="mt-2 flex items-center gap-1.5">
          <input
            value={saisie}
            onChange={(e) => setSaisie(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                validerSaisieLibre()
              }
            }}
            placeholder="Autre question..."
            className={`w-full max-w-xs rounded-lg border border-navy-900/10 bg-white px-3 py-2 text-xs text-navy-700 outline-none transition-colors focus:border-gold-400/50 ${
              desactive ? 'pointer-events-none opacity-50' : ''
            }`}
          />
          <button
            type="button"
            onClick={validerSaisieLibre}
            title="Envoyer"
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-navy-900/10 bg-white text-navy-700/60 transition-colors hover:border-gold-400/50 hover:text-navy-900 ${
              desactive ? 'pointer-events-none opacity-50' : ''
            }`}
          >
            <Send size={13} />
          </button>
        </div>
      )}
    </div>
  )
}
