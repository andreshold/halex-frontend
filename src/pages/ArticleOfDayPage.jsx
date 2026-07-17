import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Sparkles, BookOpenText, MessageSquareText, CalendarDays } from 'lucide-react'
import { articleArchive, getArticleOfTheDay } from '../data/articles.js'
import SectionHeading from '../components/SectionHeading.jsx'
import Reveal from '../components/motion/Reveal.jsx'
import Magnetic from '../components/motion/Magnetic.jsx'
import AuroraBackground from '../components/motion/AuroraBackground.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'

export default function ArticleOfDayPage() {
  const { lang, t } = useLanguage()
  const p = t.articleOfDayPage
  const todayArticle = getArticleOfTheDay()
  const [selected, setSelected] = useState(todayArticle)
  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const isToday = selected.article === todayArticle.article && selected.code === todayArticle.code
  const selectedKey = `${selected.code}-${selected.article}`

  return (
    <div>
      <section className="relative overflow-hidden bg-navy-950 px-5 py-20 sm:px-8">
        <AuroraBackground />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto max-w-3xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-gold-300">
            <motion.span
              animate={{ rotate: [0, 15, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Sparkles size={14} />
            </motion.span>
            {t.articleOfDay.badge}
          </span>
          <h1 className="mt-6 font-display text-4xl font-extrabold text-white sm:text-5xl">
            {p.titleStart} <span className="text-gradient-animated">{p.titleGradient}</span> {p.titleEnd}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-cream-100/70">{p.paragraph}</p>
        </motion.div>
      </section>

      <section className="bg-cream-50 px-5 py-20 sm:px-8">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-[2fr_1fr]">
          {/* Main article */}
          <div className="relative overflow-hidden rounded-3xl border border-navy-900/5 bg-white p-8 shadow-card sm:p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedKey}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-gold-50 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-gold-600">
                    {isToday ? p.today : p.archiveBadge}
                  </span>
                  {isToday && (
                    <span className="flex items-center gap-1.5 text-xs capitalize text-navy-700/50">
                      <CalendarDays size={14} />
                      {today}
                    </span>
                  )}
                </div>

                <div className="mt-6">
                  <span className="text-sm font-semibold text-gold-600">
                    {lang === 'fr' ? selected.codeFr : selected.code} &middot; {selected.article}
                  </span>
                  <h2 className="mt-2 font-display text-2xl font-bold text-navy-900 sm:text-3xl">
                    {lang === 'fr' ? selected.titleFr : selected.title}
                  </h2>
                </div>

                <div className="mt-6 rounded-2xl bg-cream-100/60 p-5">
                  <p className="text-sm italic leading-relaxed text-navy-800/80">
                    &ldquo;{lang === 'fr' ? selected.fullTextFr : selected.fullText}&rdquo;
                  </p>
                </div>

                <div className="mt-6 flex items-start gap-3 rounded-2xl border border-gold-400/20 bg-gold-50/60 p-5">
                  <BookOpenText size={18} className="mt-0.5 shrink-0 text-gold-600" />
                  <p className="text-sm leading-relaxed text-navy-800/80">
                    <span className="font-semibold text-gold-700">{p.explanationLabel} </span>
                    {lang === 'fr' ? selected.explanationFr : selected.explanation}
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-2">
                    {(lang === 'fr' ? selected.tagsFr : selected.tags).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-cream-100 px-3 py-1 text-xs text-navy-700/60"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Magnetic strength={0.2}>
                    <Link
                      to="/halex-chat"
                      className="inline-flex items-center gap-1.5 rounded-full bg-navy-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-900"
                    >
                      <MessageSquareText size={16} />
                      {p.askMore}
                    </Link>
                  </Magnetic>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Archive list */}
          <Reveal direction="left">
            <h3 className="mb-4 font-display text-lg font-bold text-navy-900">{p.recentArchive}</h3>
            <div className="space-y-3">
              {articleArchive.map((item) => {
                const active = item.article === selected.article && item.code === selected.code
                return (
                  <motion.button
                    key={`${item.code}-${item.article}`}
                    onClick={() => setSelected(item)}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative block w-full overflow-hidden rounded-2xl border p-4 text-left transition-colors ${
                      active
                        ? 'border-gold-400 bg-white shadow-gold'
                        : 'border-navy-900/5 bg-white/60 hover:border-gold-400/30 hover:bg-white'
                    }`}
                  >
                    <span className="text-xs font-semibold text-gold-600">
                      {lang === 'fr' ? item.codeFr : item.code} &middot; {item.article}
                    </span>
                    <p className="mt-1 text-sm font-semibold text-navy-900">
                      {lang === 'fr' ? item.titleFr : item.title}
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs text-navy-700/50">
                      {lang === 'fr' ? item.excerptFr : item.excerpt}
                    </p>
                  </motion.button>
                )
              })}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-navy-900 px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <SectionHeading
              eyebrow={p.ctaEyebrow}
              title={p.ctaTitle}
              subtitle={p.ctaSubtitle}
              light
            />
          </Reveal>
          <Reveal delay={0.1}>
            <Magnetic>
              <Link
                to="/inscription"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold-400 px-7 py-3.5 text-sm font-semibold text-navy-950 shadow-gold transition hover:bg-gold-300"
              >
                {p.startFree}
              </Link>
            </Magnetic>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
