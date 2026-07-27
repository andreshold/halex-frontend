import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, ArrowUpRight, BookOpenText } from 'lucide-react'
import SpotlightCard from './motion/SpotlightCard.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'

export default function ArticleOfDay({ compact = false }) {
  const { lang, t } = useLanguage()
  const a = t.articleOfDay
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  useEffect(() => {
    let annule = false
    fetch('http://localhost:8000/article-du-jour')
      .then((res) => {
        if (!res.ok) throw new Error(`Erreur serveur (${res.status})`)
        return res.json()
      })
      .then((data) => {
        if (!annule) setArticle(data)
      })
      .catch(console.error)
      .finally(() => {
        if (!annule) setLoading(false)
      })
    return () => {
      annule = true
    }
  }, [])

  if (loading || !article) {
    return (
      <SpotlightCard
        dark
        tilt={false}
        className="relative overflow-hidden rounded-3xl border border-gold-400/20 bg-gradient-to-br from-navy-900 via-navy-850 to-navy-950 p-8 shadow-2xl sm:p-10"
      >
        <div className="relative flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-gold-300">
            <motion.span
              animate={{ rotate: [0, 15, -10, 0], scale: [1, 1.15, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Sparkles size={14} />
            </motion.span>
            {a.badge}
          </div>
          <span className="text-xs capitalize text-cream-100/50">{today}</span>
        </div>
        <p className="relative mt-6 text-sm text-cream-100/60">{a.loading}</p>
      </SpotlightCard>
    )
  }

  return (
    <SpotlightCard
      dark
      tilt={false}
      className="relative overflow-hidden rounded-3xl border border-gold-400/20 bg-gradient-to-br from-navy-900 via-navy-850 to-navy-950 p-8 shadow-2xl sm:p-10"
    >
      <motion.div
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold-400/10 blur-3xl"
        animate={{ x: [0, 20, -10, 0], y: [0, -15, 10, 0], scale: [1, 1.08, 0.96, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-gold-400/5 blur-3xl"
        animate={{ x: [0, -15, 10, 0], y: [0, 10, -10, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-gold-300">
          <motion.span
            animate={{ rotate: [0, 15, -10, 0], scale: [1, 1.15, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Sparkles size={14} />
          </motion.span>
          {a.badge}
        </div>
        <span className="text-xs capitalize text-cream-100/50">{today}</span>
      </div>

      <div className="relative mt-6 flex flex-col gap-2">
        <h3 className="font-display text-2xl font-bold text-white sm:text-3xl">
          {article.titre}
        </h3>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-cream-100/70 sm:text-base">
          {article.extrait}
        </p>
      </div>

      {!compact && (
        <div className="relative mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="flex items-start gap-2 text-sm leading-relaxed text-cream-100/80">
            <BookOpenText size={16} className="mt-0.5 shrink-0 text-gold-400" />
            <span>
              <span className="font-semibold text-gold-300">{a.explanationLabel} </span>
              {lang === 'fr' ? article.explication_fr : article.explication_ht}
            </span>
          </p>
        </div>
      )}

      <div className="relative mt-7 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <motion.span
              key={tag}
              whileHover={{ scale: 1.08, backgroundColor: 'rgba(212,175,55,0.15)' }}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-cream-100/60"
            >
              {tag}
            </motion.span>
          ))}
        </div>
        <Link
          to="/article-du-jour"
          className="group inline-flex items-center gap-1.5 text-sm font-semibold text-gold-300 transition hover:text-gold-200"
        >
          {a.readMore}
          <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </SpotlightCard>
  )
}
