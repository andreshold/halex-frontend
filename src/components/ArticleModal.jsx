import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { X, FileText, Copy, Check, Share2 } from 'lucide-react'

export default function ArticleModal({ source, onClose, t = {} }) {
  const [copyState, setCopyState] = useState('idle') // 'idle' | 'copied'
  const [shareState, setShareState] = useState('idle') // 'idle' | 'copied' (repli desktop uniquement)

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose])

  if (!source) return null

  const contenuAttribue = `${source.article} — ${source.source}\n\n${source.texte}\n\n— via Halex AI`

  async function copier() {
    await navigator.clipboard.writeText(contenuAttribue)
    setCopyState('copied')
    setTimeout(() => setCopyState('idle'), 1500)
  }

  async function partager() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${source.article} — ${source.source}`,
          text: contenuAttribue,
        })
      } catch {
        // Annulation utilisateur : ne rien faire.
      }
      return
    }
    await navigator.clipboard.writeText(contenuAttribue)
    setShareState('copied')
    setTimeout(() => setShareState('idle'), 1500)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/50 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-navy-900/10 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête branding */}
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-navy-900/[0.06] px-5 py-3.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex overflow-hidden rounded-lg bg-cream-50 p-0.5 shadow-sm">
              <img src="/image/halex_logo.png" alt="Halex AI" className="h-6 w-auto rounded-md object-contain" />
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.close ?? 'Fermer'}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-navy-700/50 transition-colors hover:bg-navy-900/5 hover:text-navy-900"
          >
            <X size={16} />
          </button>
        </div>

        {/* Titre de l'article */}
        <div className="shrink-0 border-b border-navy-900/[0.06] px-5 py-3">
          <h3 className="flex items-center gap-2 font-mono text-[13px] font-semibold text-navy-900">
            <FileText size={14} className="shrink-0 text-gold-600/70" />
            {source.article} — {source.source}
          </h3>
        </div>

        {/* Corps : texte intégral, scrollable */}
        <div className="scroll-thin flex-1 overflow-y-auto px-5 py-4">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-navy-800">
            {source.texte}
          </p>
        </div>

        {/* Barre d'actions */}
        <div className="flex shrink-0 items-center justify-end gap-2 border-t border-navy-900/[0.06] px-5 py-3">
          <button
            type="button"
            onClick={copier}
            className="flex items-center gap-1.5 rounded-full border border-navy-900/10 px-3.5 py-1.5 text-xs font-medium text-navy-700 transition-colors hover:border-gold-400/40 hover:bg-gold-400/5 hover:text-gold-700"
          >
            {copyState === 'copied' ? <Check size={13} /> : <Copy size={13} />}
            {copyState === 'copied' ? t.copied ?? 'Copié !' : t.copy ?? 'Copier'}
          </button>
          <button
            type="button"
            onClick={partager}
            className="flex items-center gap-1.5 rounded-full bg-gradient-to-br from-gold-300 to-gold-500 px-3.5 py-1.5 text-xs font-semibold text-navy-950 shadow-gold transition hover:from-gold-200 hover:to-gold-400"
          >
            {shareState === 'copied' ? <Check size={13} /> : <Share2 size={13} />}
            {shareState === 'copied' ? t.copied ?? 'Copié !' : t.share ?? 'Partager'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
