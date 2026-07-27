import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Sparkles, BookOpenText, MessageSquareText, CalendarDays, Copy, Share2, Check } from 'lucide-react'
import SectionHeading from '../components/SectionHeading.jsx'
import Reveal from '../components/motion/Reveal.jsx'
import Magnetic from '../components/motion/Magnetic.jsx'
import AuroraBackground from '../components/motion/AuroraBackground.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'

export default function ArticleOfDayPage() {
  const { lang, t } = useLanguage()
  const p = t.articleOfDayPage
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [archives, setArchives] = useState([])
  const [archivesLoading, setArchivesLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)
  const [articleAffiche, setArticleAffiche] = useState(null)
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
      .catch((err) => {
        console.error(err)
        if (!annule) setError(true)
      })
      .finally(() => {
        if (!annule) setLoading(false)
      })
    return () => {
      annule = true
    }
  }, [])

  useEffect(() => {
    let annule = false
    fetch('http://localhost:8000/article-du-jour/archives')
      .then((res) => {
        if (!res.ok) throw new Error(`Erreur serveur (${res.status})`)
        return res.json()
      })
      .then((data) => {
        if (!annule) setArchives(data)
      })
      .catch(console.error)
      .finally(() => {
        if (!annule) setArchivesLoading(false)
      })
    return () => {
      annule = true
    }
  }, [])

  const articleCourant = articleAffiche ?? article

  async function copier() {
    if (!articleCourant) return
    const explication = lang === 'fr' ? articleCourant.explication_fr : articleCourant.explication_ht
    const texte = `${articleCourant.titre}\n\n${articleCourant.texte_complet}\n\n${explication}\n\nSous : Halex AI`
    try {
      await navigator.clipboard.writeText(texte)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error(err)
    }
  }

  async function partager() {
    if (!articleCourant) return
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title: articleCourant.titre, text: articleCourant.extrait, url })
      } catch (err) {
        console.error(err)
      }
      return
    }
    try {
      await navigator.clipboard.writeText(url)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
    } catch (err) {
      console.error(err)
    }
  }

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
        <div className="mx-auto max-w-3xl">
          {/* Main article */}
          <div className="relative overflow-hidden rounded-3xl border border-navy-900/5 bg-white p-8 shadow-card sm:p-10">
            {loading && <p className="text-sm text-navy-700/60">{p.loading}</p>}
            {!loading && error && <p className="text-sm text-red-600">{p.error}</p>}
            {!loading && !error && articleCourant && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={articleAffiche ? `archive-${articleAffiche.tranche}` : 'du-jour'}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full bg-gold-50 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-gold-600">
                      {articleAffiche ? p.archiveBadge : p.today}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs capitalize text-navy-700/50">
                      <CalendarDays size={14} />
                      {articleAffiche
                        ? new Date(articleAffiche.created_at).toLocaleDateString('fr-FR', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })
                        : today}
                    </span>
                  </div>

                  {articleAffiche && (
                    <button
                      type="button"
                      onClick={() => setArticleAffiche(null)}
                      className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-600 transition hover:text-gold-700"
                    >
                      ← Revenir à l'article du jour
                    </button>
                  )}

                  <div className="mt-6">
                    <h2 className="font-display text-2xl font-bold text-navy-900 sm:text-3xl">
                      {articleCourant.titre}
                    </h2>
                  </div>

                  <div className="mt-6 rounded-2xl bg-cream-100/60 p-5">
                    <p className="text-sm italic leading-relaxed text-navy-800/80">
                      &ldquo;{articleCourant.texte_complet}&rdquo;
                    </p>
                  </div>

                  <div className="mt-6 flex items-start gap-3 rounded-2xl border border-gold-400/20 bg-gold-50/60 p-5">
                    <BookOpenText size={18} className="mt-0.5 shrink-0 text-gold-600" />
                    <p className="text-sm leading-relaxed text-navy-800/80">
                      <span className="font-semibold text-gold-700">{p.explanationLabel} </span>
                      {lang === 'fr' ? articleCourant.explication_fr : articleCourant.explication_ht}
                    </p>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {articleCourant.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-cream-100 px-3 py-1 text-xs text-navy-700/60"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <Magnetic strength={0.2}>
                      <button
                        type="button"
                        onClick={copier}
                        className="inline-flex items-center gap-1.5 rounded-full border border-navy-900/10 bg-white px-5 py-2.5 text-sm font-semibold text-navy-900 transition hover:border-gold-400/40 hover:text-gold-600"
                      >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                        {copied ? p.copied : p.copy}
                      </button>
                    </Magnetic>
                    <Magnetic strength={0.2}>
                      <button
                        type="button"
                        onClick={partager}
                        className="inline-flex items-center gap-1.5 rounded-full border border-navy-900/10 bg-white px-5 py-2.5 text-sm font-semibold text-navy-900 transition hover:border-gold-400/40 hover:text-gold-600"
                      >
                        {linkCopied ? <Check size={16} /> : <Share2 size={16} />}
                        {linkCopied ? p.linkCopied : p.share}
                      </button>
                    </Magnetic>
                    <Magnetic strength={0.2}>
                      <Link
                        to="/halex-chat"
                        className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-navy-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-900"
                      >
                        <MessageSquareText size={16} />
                        {p.askMore}
                      </Link>
                    </Magnetic>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          {/* Archives */}
          <Reveal className="mt-10" direction="left">
            <h3 className="mb-4 font-display text-lg font-bold text-navy-900">{p.recentArchive}</h3>
            {archivesLoading && <p className="text-sm text-navy-700/60">{p.loading}</p>}
            {!archivesLoading && archives.length === 0 && (
              <p className="text-sm text-navy-700/60">{p.noArchive}</p>
            )}
            {!archivesLoading && archives.length > 0 && (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {archives.map((item) => (
                  <button
                    type="button"
                    key={item.tranche}
                    onClick={() => setArticleAffiche(item)}
                    className={`relative block w-full cursor-pointer overflow-hidden rounded-2xl border p-4 text-left transition hover:border-gold-400/40 hover:bg-white ${
                      articleAffiche?.tranche === item.tranche
                        ? 'border-gold-400/50 bg-white'
                        : 'border-navy-900/5 bg-white/60'
                    }`}
                  >
                    <span className="text-xs font-semibold text-gold-600">
                      {new Date(item.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                    <p className="mt-1 text-sm font-semibold text-navy-900">{item.titre}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-navy-700/50">{item.extrait}</p>
                  </button>
                ))}
              </div>
            )}
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
