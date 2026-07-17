import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, BookMarked, ArrowUpRight } from 'lucide-react'
import { legalCodes } from '../data/legalCodes.js'
import SpotlightCard from '../components/motion/SpotlightCard.jsx'
import AuroraBackground from '../components/motion/AuroraBackground.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'

export default function Documents() {
  const { lang, t } = useLanguage()
  const d = t.documents
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)

  const filtered = legalCodes.filter((code) => {
    const q = query.toLowerCase()
    return (
      code.name.toLowerCase().includes(q) ||
      code.nameFr.toLowerCase().includes(q) ||
      code.tags.some((tag) => tag.toLowerCase().includes(q)) ||
      code.tagsFr.some((tag) => tag.toLowerCase().includes(q))
    )
  })

  return (
    <div>
      <section className="relative overflow-hidden bg-navy-950 px-5 py-20 sm:px-8">
        <AuroraBackground />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto max-w-4xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-gold-300">
            {d.eyebrow}
          </span>
          <h1 className="mt-6 font-display text-4xl font-extrabold text-white sm:text-5xl">
            {d.titleStart} <span className="text-gradient-animated">{d.titleGradient}</span>
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-cream-100/70">{d.paragraph}</p>

          <motion.div
            animate={{
              boxShadow: focused
                ? '0 0 0 1px rgba(212,175,55,0.5), 0 8px 30px -8px rgba(212,175,55,0.35)'
                : '0 0 0 1px rgba(255,255,255,0.1), 0 0px 0px rgba(212,175,55,0)',
            }}
            transition={{ duration: 0.3 }}
            className="mx-auto mt-8 flex max-w-lg items-center gap-3 rounded-full bg-white/5 px-5 py-3 backdrop-blur"
          >
            <Search size={18} className="text-cream-100/40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder={d.searchPlaceholder}
              className="w-full bg-transparent text-sm text-white placeholder:text-cream-100/40 focus:outline-none"
            />
          </motion.div>
        </motion.div>
      </section>

      <section className="bg-cream-50 px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <AnimatePresence mode="wait">
            {filtered.length === 0 ? (
              <motion.p
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center text-navy-700/60"
              >
                {d.noResults(query)}
              </motion.p>
            ) : (
              <motion.div
                key="grid"
                layout
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                <AnimatePresence mode="popLayout">
                  {filtered.map((code) => (
                    <motion.div
                      key={code.id}
                      layout
                      initial={{ opacity: 0, y: 16, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <SpotlightCard className="group flex h-full flex-col rounded-2xl border border-navy-900/5 bg-white p-7 shadow-card">
                        <div className="flex items-start justify-between gap-3">
                          <motion.div
                            whileHover={{ rotate: -6, scale: 1.08 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                            className="inline-flex rounded-xl bg-navy-950 p-3 text-gold-400"
                          >
                            <BookMarked size={20} />
                          </motion.div>
                          <span className="rounded-full bg-gold-50 px-2.5 py-1 text-xs font-semibold text-gold-600">
                            {code.articles} {d.articlesSuffix}
                          </span>
                        </div>
                        <h3 className="mt-5 font-display text-lg font-bold text-navy-900">
                          {lang === 'fr' ? code.nameFr : code.name}
                        </h3>
                        <p className="text-xs italic text-navy-700/50">
                          {lang === 'fr' ? code.name : code.nameFr}
                        </p>
                        <p className="mt-3 flex-1 text-sm leading-relaxed text-navy-700/70">
                          {lang === 'fr' ? code.descriptionFr : code.description}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {(lang === 'fr' ? code.tagsFr : code.tags).map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-cream-100 px-2.5 py-1 text-xs text-navy-700/60"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <Link
                          to="/halex-chat"
                          className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-900 transition group-hover:text-gold-600"
                        >
                          {d.exploreWithAi}
                          <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1" />
                        </Link>
                      </SpotlightCard>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  )
}
