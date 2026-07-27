import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Send,
  Plus,
  Menu,
  X,
  LogOut,
  Scale,
  Search,
  Sparkles,
  Copy,
  Check,
  RotateCw,
  Gavel,
  Briefcase,
  Users,
  Home,
  Settings,
  Pencil,
  Share2,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import MessageContent from '../components/MessageContent.jsx'
import SourceChip from '../components/SourceChip.jsx'
import AvatarHalex from '../components/AvatarHalex.jsx'
import ArticleModal from '../components/ArticleModal.jsx'
import ChipsClarification from '../components/ChipsClarification.jsx'
import ParametresModal from '../components/ParametresModal.jsx'
import { suggestedPrompts } from '../data/chatMock.js'
import {
  creerConversation,
  enregistrerMessage,
  listerConversations,
  chargerMessages,
  modifierMessage,
  regenererReponse,
} from '../lib/historique.js'

const avatarPalette = [
  'bg-gold-400 text-navy-950',
  'bg-emerald-400 text-navy-950',
  'bg-sky-400 text-navy-950',
  'bg-rose-400 text-navy-950',
  'bg-violet-400 text-navy-950',
]

function avatarClass(id) {
  const sum = [...id].reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
  return avatarPalette[sum % avatarPalette.length]
}

const categoryDefs = [
  { id: 'civil', icon: Scale },
  { id: 'criminal', icon: Gavel },
  { id: 'labor', icon: Briefcase },
  { id: 'family', icon: Users },
]

const MODES = [
  { id: 'citoyen', label: 'Citoyen', description: 'Réponses pratiques : vos droits, vos démarches' },
  { id: 'educatif', label: 'Éducatif', description: 'Explications pédagogiques avec exemples' },
  { id: 'judiciaire', label: 'Judiciaire', description: 'Réponses techniques pour professionnels du droit' },
]

const listContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}
const listItem = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
}

export default function Chat() {
  const { user, logout, mettreAJourModeReponse } = useAuth()
  const { lang: siteLang, t } = useLanguage()
  const chatText = t.chat
  const navigate = useNavigate()

  const [conversations, setConversations] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [input, setInput] = useState('')
  const [inputFocused, setInputFocused] = useState(false)
  const [thinking, setThinking] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState(null)
  const [copiedIndex, setCopiedIndex] = useState(null)
  const [articleOuvert, setArticleOuvert] = useState(null)
  const [parametresOuverts, setParametresOuverts] = useState(false)
  const [menuOuvert, setMenuOuvert] = useState(false)
  const mode = user?.modeReponse || 'citoyen'
  const [messageEnEdition, setMessageEnEdition] = useState(null)
  const [texteEdition, setTexteEdition] = useState('')
  const [regenerationEnCours, setRegenerationEnCours] = useState(null)
  const [partageCopieIndex, setPartageCopieIndex] = useState(null)
  const scrollRef = useRef(null)
  const textareaRef = useRef(null)
  const menuModeRef = useRef(null)

  const activeConversation = conversations.find((c) => c.id === activeId) || null
  const filteredConversations = conversations.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) &&
      (!activeCategory || c.category === activeCategory),
  )

  useEffect(() => {
  if (!user) return
  listerConversations()
    .then((rows) =>
      setConversations(
        rows.map((r) => ({ id: r.id, title: r.titre, updatedAt: r.created_at, messages: [] })),
      ),
    )
    .catch(console.error)
}, [user])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [activeConversation?.messages.length, thinking])

  useEffect(() => {
    if (!menuOuvert) return
    function handleClickOutside(e) {
      if (menuModeRef.current && !menuModeRef.current.contains(e.target)) {
        setMenuOuvert(false)
      }
    }
    function handleKeyDown(e) {
      if (e.key === 'Escape') setMenuOuvert(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [menuOuvert])

  function handleLogout() {
    logout()
    navigate('/')
  }

  function startNewConversation() {
    setActiveId(null)
    setSidebarOpen(false)
  }

  function handleHistoriqueEffacee() {
    setConversations([])
    setActiveId(null)
  }

  async function openConversation(convId) {
  setActiveId(convId)
  setSidebarOpen(false)
  const conv = conversations.find((c) => c.id === convId)
  if (conv && conv.messages.length === 0) {
    try {
      const msgs = await chargerMessages(convId)
      setConversations((prev) =>
        prev.map((c) =>
          c.id === convId
            ? {
                ...c,
                messages: msgs.map((m) => ({
                  id: m.id,
                  created_at: m.created_at,
                  role: m.role,
                  content: m.contenu,
                  sources: m.sources,
                })),
              }
            : c,
        ),
      )
    } catch (err) {
      console.error(err)
    }
  }
}


  function autoGrow() {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`
  }

  // Appel brut du backend, sans effet de bord sur le state ni la persistance —
  // partagé entre l'envoi normal (replyTo) et la régénération sur place.
  async function appelerHalex(forMessage, extra = null) {
    const res = await fetch('http://localhost:8000/poser-question', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: forMessage, mode, ...(extra || {}) }),
    })
    if (!res.ok) throw new Error(`Erreur serveur (${res.status})`)
    return res.json()
  }

  async function replyTo(convId, forMessage, extra = null) {
  setThinking(true)
  try {
    const data = await appelerHalex(forMessage, extra)
    const sources = data.sources || []
    const { id, created_at } = await enregistrerMessage(convId, 'assistant', data.reponse, sources)
    setConversations((prev) =>
      prev.map((c) =>
        c.id === convId
          ? {
              ...c,
              messages: [
                ...c.messages,
                {
                  id,
                  created_at,
                  role: 'assistant',
                  content: data.reponse,
                  sources,
                  type: data.type,
                  options: data.options,
                  contexte_clarification: data.contexte_clarification,
                  autre_autorise: data.autre_autorise,
                  resolue: false,
                },
              ],
            }
          : c,
      ),
    )
  } catch (err) {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === convId
          ? {
              ...c,
              messages: [
                ...c.messages,
                {
                  role: 'assistant',
                  content:
                    "⚠️ Impossible de joindre le serveur Halex pour le moment. Vérifiez que l'API est bien lancée, puis réessayez.",
                },
              ],
            }
          : c,
      ),
    )
  } finally {
    setThinking(false)
  }
}

  async function sendMessage(text) {
  const content = text.trim()
  if (!content) return

  if (!activeConversation) {
    try {
      const convId = await creerConversation(user.id, content)
      const { id, created_at } = await enregistrerMessage(convId, 'user', content)
      const newConv = {
        id: convId,
        title: content.slice(0, 40) + (content.length > 40 ? '…' : ''),
        updatedAt: new Date().toISOString(),
        messages: [{ id, created_at, role: 'user', content }],
      }
      setConversations((prev) => [newConv, ...prev])
      setActiveId(convId)
      setInput('')
      requestAnimationFrame(autoGrow)
      replyTo(convId, content)
    } catch (err) {
      console.error(err)
    }
    return
  }

  try {
    const { id, created_at } = await enregistrerMessage(activeConversation.id, 'user', content)
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversation.id
          ? { ...c, messages: [...c.messages, { id, created_at, role: 'user', content }] }
          : c,
      ),
    )
    setInput('')
    requestAnimationFrame(autoGrow)
    replyTo(activeConversation.id, content)
  } catch (err) {
    console.error(err)
  }
}

  async function regenerate(messageIndex) {
    if (!activeConversation || regenerationEnCours) return
    const targetMsg = activeConversation.messages[messageIndex]
    if (!targetMsg || targetMsg.role !== 'assistant' || !targetMsg.id) return
    const priorUserMsg = [...activeConversation.messages.slice(0, messageIndex)].reverse().find((m) => m.role === 'user')
    if (!priorUserMsg) return

    const convId = activeConversation.id
    setRegenerationEnCours(targetMsg.id)
    try {
      const data = await appelerHalex(priorUserMsg.content)
      const sources = data.sources || []
      await regenererReponse(targetMsg.id, data.reponse, sources)
      setConversations((prev) =>
        prev.map((c) =>
          c.id === convId
            ? {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === targetMsg.id
                    ? {
                        ...m,
                        content: data.reponse,
                        sources,
                        type: data.type,
                        options: data.options,
                        contexte_clarification: data.contexte_clarification,
                        autre_autorise: data.autre_autorise,
                        resolue: false,
                      }
                    : m,
                ),
              }
            : c,
        ),
      )
    } catch (err) {
      console.error(err)
    } finally {
      setRegenerationEnCours(null)
    }
  }

  async function handleChoixClarification(messageIndex, { texte, contexte }) {
    if (!activeConversation) return
    const questionOrigine = contexte?.numero
      ? [...activeConversation.messages.slice(0, messageIndex)]
          .reverse()
          .find((m) => m.role === 'user')?.content
      : null

    try {
      const { id, created_at } = await enregistrerMessage(activeConversation.id, 'user', texte)
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConversation.id
            ? {
                ...c,
                messages: [
                  ...c.messages.map((m, idx) => (idx === messageIndex ? { ...m, resolue: true } : m)),
                  { id, created_at, role: 'user', content: texte },
                ],
              }
            : c,
        ),
      )
    } catch (err) {
      console.error(err)
      return
    }

    if (contexte?.numero) {
      replyTo(activeConversation.id, questionOrigine, {
        numero_article: contexte.numero,
        source_choisie: texte,
      })
    } else {
      replyTo(activeConversation.id, texte)
    }
  }

  function copyMessage(text, index) {
    navigator.clipboard?.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex((i) => (i === index ? null : i)), 1600)
  }

  async function partagerReponse(messageIndex) {
    if (!activeConversation) return
    const msg = activeConversation.messages[messageIndex]
    if (!msg || msg.role !== 'assistant') return
    const priorUserMsg = [...activeConversation.messages.slice(0, messageIndex)].reverse().find((m) => m.role === 'user')

    const parties = []
    if (priorUserMsg) parties.push(priorUserMsg.content)
    parties.push(msg.content)
    if (msg.sources?.length > 0) {
      const sourcesTexte = msg.sources.map((src) => `${src.article} — ${src.source}`).join('; ')
      parties.push(`Sources : ${sourcesTexte}`)
    }
    parties.push('— via Halex AI')
    const texte = parties.join('\n\n')

    if (navigator.share) {
      try {
        await navigator.share({ text: texte })
      } catch (err) {
        if (err?.name !== 'AbortError') console.error(err)
      }
      return
    }

    try {
      await navigator.clipboard.writeText(texte)
      setPartageCopieIndex(messageIndex)
      setTimeout(() => setPartageCopieIndex((idx) => (idx === messageIndex ? null : idx)), 2000)
    } catch (err) {
      console.error(err)
    }
  }

  function commencerEdition(msg) {
    setMessageEnEdition(msg.id)
    setTexteEdition(msg.content)
  }

  function annulerEdition() {
    setMessageEnEdition(null)
    setTexteEdition('')
  }

  async function soumettreEdition(msg, messageIndex) {
    const nouveauContenu = texteEdition.trim()
    if (!nouveauContenu || !activeConversation || thinking) return
    const convId = activeConversation.id

    try {
      // Nettoie d'abord la base (supprime les messages postérieurs, met à jour le contenu),
      // puis seulement si ça réussit on tronque le state et on relance la génération —
      // pour ne jamais désynchroniser l'UI de ce qui est réellement persisté.
      await modifierMessage(convId, msg.id, nouveauContenu, msg.created_at)
      setConversations((prev) =>
        prev.map((c) =>
          c.id === convId
            ? { ...c, messages: [...c.messages.slice(0, messageIndex), { ...msg, content: nouveauContenu }] }
            : c,
        ),
      )
      annulerEdition()
      replyTo(convId, nouveauContenu)
    } catch (err) {
      console.error(err)
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    sendMessage(input)
  }

  const composer = (
    <motion.div
      animate={{
        boxShadow: inputFocused
          ? '0 0 0 1px rgba(212,175,55,0.55), 0 16px 40px -14px rgba(212,175,55,0.35)'
          : '0 1px 2px rgba(15,23,42,0.04), 0 10px 30px -14px rgba(15,23,42,0.1)',
      }}
      transition={{ duration: 0.25 }}
      className="relative mx-auto w-full max-w-3xl 2xl:max-w-4xl"
    >
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -inset-px rounded-[26px] bg-gradient-to-r from-gold-400/70 via-sky-400/40 to-gold-400/70 bg-[length:200%_auto] blur-[2px] transition-opacity duration-300 ${
          inputFocused ? 'animate-gradient-shift opacity-100' : 'opacity-0'
        }`}
      />
      <div className="relative overflow-visible rounded-3xl border border-navy-900/10 bg-white/90 backdrop-blur-xl">
        <div className="flex items-end gap-2 px-4 pt-3.5">
          <motion.span
            animate={{ opacity: [0.55, 1, 0.55] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            className="mb-2 shrink-0"
          >
            <Sparkles size={17} className="text-gold-400" />
          </motion.span>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              autoGrow()
            }}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                sendMessage(input)
              }
            }}
            rows={1}
            placeholder={chatText.inputPlaceholder}
            className="max-h-48 flex-1 resize-none bg-transparent py-1.5 text-sm text-navy-900 outline-none transition-[height] duration-100"
          />
        </div>

        <div className="mt-2 flex items-center justify-between border-t border-navy-900/5 px-3.5 py-2">
          <div className="flex items-center gap-1.5">
            <div className="relative" ref={menuModeRef}>
              <div className="flex items-center gap-1.5">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setMenuOuvert((v) => !v)}
                  title="Mode de réponse"
                  aria-label="Mode de réponse"
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-navy-900/10 text-navy-700/40 transition-colors hover:border-gold-400/40 hover:text-gold-600"
                >
                  <Plus size={14} />
                </motion.button>

                {mode !== 'citoyen' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-center gap-1 rounded-full border border-gold-400/30 bg-gold-400/5 py-1 pl-2.5 pr-1.5 text-[11px] font-medium text-gold-700"
                  >
                    <button type="button" onClick={() => setMenuOuvert(true)}>
                      {MODES.find((m) => m.id === mode)?.label}
                    </button>
                    <button
                      type="button"
                      onClick={() => mettreAJourModeReponse('citoyen').catch(console.error)}
                      title="Revenir au mode Citoyen"
                      aria-label="Revenir au mode Citoyen"
                      className="flex h-4 w-4 items-center justify-center rounded-full text-gold-700/60 transition-colors hover:bg-gold-400/20 hover:text-gold-700"
                    >
                      <X size={11} />
                    </button>
                  </motion.div>
                )}
              </div>

              <AnimatePresence>
                {menuOuvert && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute bottom-full left-0 z-30 mb-2 w-64 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-navy-900/10 bg-white shadow-2xl"
                  >
                    <p className="border-b border-navy-900/[0.06] px-3.5 py-2 text-[11px] font-semibold uppercase tracking-wider text-navy-700/40">
                      Mode de réponse
                    </p>
                    <div className="py-1">
                      {MODES.map((m) => {
                        const actif = mode === m.id
                        return (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => {
                              mettreAJourModeReponse(m.id).catch(console.error)
                              setMenuOuvert(false)
                            }}
                            className="flex w-full items-start gap-2 px-3.5 py-2 text-left transition-colors hover:bg-navy-900/[0.03]"
                          >
                            <div className="min-w-0 flex-1">
                              <p className={`text-sm font-medium ${actif ? 'text-gold-700' : 'text-navy-900'}`}>
                                {m.label}
                              </p>
                              <p className="mt-0.5 text-xs text-navy-700/45">{m.description}</p>
                            </div>
                            {actif && <Check size={14} className="mt-0.5 shrink-0 text-gold-600" />}
                          </button>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-1.5 rounded-full border border-navy-900/10 bg-navy-900/[0.02] px-3 py-1.5 text-[11px] font-medium tracking-wide text-navy-700/50">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              Halex AI
            </div>
          </div>

          <motion.button
            whileHover={input.trim() ? { scale: 1.08 } : {}}
            whileTap={input.trim() ? { scale: 0.9 } : {}}
            type="submit"
            disabled={!input.trim()}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold-300 to-gold-500 text-navy-950 shadow-gold transition-colors hover:from-gold-200 hover:to-gold-400 disabled:cursor-not-allowed disabled:bg-none disabled:bg-navy-900/10 disabled:text-navy-900/30 disabled:shadow-none"
          >
            <Send size={16} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-cream-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 flex transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Conversation list panel */}
        <motion.div
          animate={{ width: sidebarCollapsed ? 64 : 272 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col overflow-hidden border-r border-white/5 bg-navy-950"
        >
          <div
            className={`flex items-center gap-2 p-3 pb-2 ${
              sidebarCollapsed ? 'flex-col' : 'justify-between'
            }`}
          >
            {!sidebarCollapsed && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={startNewConversation}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-gold-300 to-gold-500 px-3 py-2.5 text-sm font-semibold text-navy-950 shadow-gold transition hover:from-gold-200 hover:to-gold-400"
              >
                <Plus size={16} />
                {chatText.newChat}
              </motion.button>
            )}

            <div className={`flex shrink-0 items-center gap-2 ${sidebarCollapsed ? 'flex-col' : ''}`}>
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => setSidebarCollapsed((c) => !c)}
                title={sidebarCollapsed ? chatText.expandSidebar : chatText.collapseSidebar}
                aria-label={sidebarCollapsed ? chatText.expandSidebar : chatText.collapseSidebar}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 text-cream-100/70 transition-colors hover:border-gold-400/40 hover:text-gold-300"
              >
                <Menu size={18} />
              </motion.button>

              {sidebarCollapsed && (
                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={startNewConversation}
                  title={chatText.newChat}
                  aria-label={chatText.newChat}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gold-300 to-gold-500 text-navy-950 shadow-gold transition hover:from-gold-200 hover:to-gold-400"
                >
                  <Plus size={16} />
                </motion.button>
              )}

              <button
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-cream-100/50 lg:hidden"
                onClick={() => setSidebarOpen(false)}
                aria-label={chatText.collapseSidebar}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {sidebarCollapsed && (
            <div className="mt-auto flex flex-col items-center gap-2 p-3">
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => setSidebarCollapsed(false)}
                title={user?.name || chatText.brand}
                aria-label={user?.name || chatText.brand}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold-300 to-gold-500 text-sm font-bold leading-none text-navy-950 shadow-gold"
              >
                {(user?.name || chatText.brand).charAt(0).toUpperCase()}
              </motion.button>
            </div>
          )}

          {!sidebarCollapsed && (
            <>
              <div className="w-[272px] space-y-3 px-3 pb-2">
                <div>
                  <p className="px-1 pb-1.5 text-xs font-semibold uppercase tracking-wider text-cream-100/30">
                    {chatText.categoriesTitle}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {categoryDefs.map(({ id, icon: Icon }) => {
                      const isActive = activeCategory === id
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setActiveCategory((c) => (c === id ? null : id))}
                          className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-xs transition-colors ${
                            isActive
                              ? 'border-gold-400/40 bg-gold-400/10 text-gold-300'
                              : 'border-white/10 text-cream-100/55 hover:border-white/20 hover:text-cream-100'
                          }`}
                        >
                          <Icon size={12} />
                          {chatText.categories[id]}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/5 px-3 py-2 transition-colors focus-within:border-gold-400/30 focus-within:bg-white/[0.07]">
                  <Search size={14} className="shrink-0 text-cream-100/30" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={chatText.searchPlaceholder}
                    className="w-full bg-transparent text-xs text-cream-100 placeholder:text-cream-100/30 focus:outline-none"
                  />
                </div>
              </div>

              <div className="scroll-thin w-[272px] flex-1 space-y-0.5 overflow-y-auto px-2 pb-4">
                <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-cream-100/30">
                  {chatText.recentConversations}
                </p>
                {filteredConversations.length === 0 ? (
                  <p className="px-3 py-2 text-xs text-cream-100/30">{chatText.noConversationsFound}</p>
                ) : (
                  filteredConversations.map((conv) => {
                    const isActive = activeId === conv.id
                    return (
                      <motion.button
                        key={conv.id}
                        layout
                       onClick={() => openConversation(conv.id)}
                        className={`relative flex w-full items-center gap-2.5 truncate rounded-lg px-2.5 py-2 text-left text-sm transition-colors ${
                          isActive ? 'text-white' : 'text-cream-100/55 hover:bg-white/5 hover:text-cream-100'
                        }`}
                      >
                        {isActive && (
                          <motion.span
                            layoutId="conv-active-pill"
                            className="absolute inset-0 rounded-lg border border-gold-400/20 bg-gradient-to-r from-gold-400/10 via-white/[0.06] to-transparent"
                            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                          />
                        )}
                        <span
                          className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${avatarClass(conv.id)}`}
                        >
                          {conv.title.charAt(0).toUpperCase()}
                        </span>
                        <span className="relative z-10 truncate">{conv.title}</span>
                      </motion.button>
                    )
                  })
                )}
              </div>

              <div className="w-[272px] shrink-0 border-t border-white/5 p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 flex-1 items-center gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold-300 to-gold-500 text-sm font-bold leading-none text-navy-950 shadow-gold">
                      {(user?.name || chatText.brand).charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-cream-100">{user?.name || chatText.brand}</p>
                      <p className="truncate text-xs text-gold-400/70">{chatText.planLabel}</p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleLogout}
                      className="flex h-8 w-8 items-center justify-center rounded-xl text-cream-100/40 transition-colors hover:bg-white/5 hover:text-gold-300"
                      title={chatText.logout}
                      aria-label={chatText.logout}
                    >
                      <LogOut size={15} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setParametresOuverts(true)}
                      className="flex h-8 w-8 items-center justify-center rounded-xl text-cream-100/40 transition-colors hover:bg-white/5 hover:text-gold-300"
                      title={chatText.settings}
                      aria-label={chatText.settings}
                    >
                      <Settings size={15} />
                    </motion.button>
                  </div>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Main chat area */}
      <div className="relative flex min-w-0 flex-1 flex-col">
        <div className="sticky top-0 z-20 flex items-center gap-3 border-b border-navy-900/[0.06] bg-cream-50/80 px-4 py-3 backdrop-blur-md sm:px-6">
          <button
            className="rounded-lg p-2 text-navy-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>
          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-center gap-2">
              <span className="truncate text-sm font-semibold text-navy-900">{chatText.assistantTitle}</span>
              <span className="flex shrink-0 items-center gap-1.5 text-xs text-emerald-600">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
                {chatText.online}
              </span>
            </div>
            {activeConversation && (
              <p className="truncate text-xs text-navy-700/45">{activeConversation.title}</p>
            )}
          </div>
          <Link
            to="/"
            className="flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-navy-700/60 transition-colors hover:bg-navy-900/5 hover:text-navy-900"
          >
            <Home size={14} />
            <span className="hidden sm:inline">{chatText.home}</span>
          </Link>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold-400/40 to-transparent" />
        </div>

        {!activeConversation ? (
          <div className="relative flex flex-1 flex-col items-center justify-center overflow-y-auto px-4 pb-16 sm:px-8">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-grid opacity-[0.35] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
              <motion.div
                className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-400/10 blur-3xl"
                animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>

            <motion.div
              variants={listContainer}
              initial="hidden"
              animate="show"
              className="relative w-full max-w-2xl text-center 2xl:max-w-3xl"
            >
              <motion.div
                variants={listItem}
                className="mx-auto inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-gold-600"
              >
                <motion.span
                  animate={{ rotate: [0, 15, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Sparkles size={13} />
                </motion.span>
                Halex AI
              </motion.div>

              <motion.h2 variants={listItem} className="mt-5 font-display text-3xl font-bold text-navy-900 sm:text-4xl">
                {chatText.greeting(user?.name?.split(' ')[0])}
              </motion.h2>

              <motion.form variants={listItem} onSubmit={handleSubmit} className="mt-8">
                {composer}
              </motion.form>

              <motion.p variants={listItem} className="mt-3 text-sm text-navy-700/50">
                {chatText.emptyStateParagraph}
              </motion.p>

              <motion.p
                variants={listItem}
                className="mt-8 text-xs font-semibold uppercase tracking-wider text-navy-700/40"
              >
                {chatText.suggestedQuestionsTitle}
              </motion.p>

              <motion.div
                variants={listContainer}
                className="mt-3 flex flex-wrap items-center justify-center gap-2"
              >
                {suggestedPrompts[siteLang].map((prompt) => (
                  <motion.button
                    key={prompt}
                    variants={listItem}
                    whileHover={{ scale: 1.03, borderColor: 'rgba(212,175,55,0.5)' }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => sendMessage(prompt)}
                    className="rounded-full border border-navy-900/10 bg-white px-4 py-2 text-left text-xs text-navy-700 shadow-sm transition-shadow hover:shadow-md"
                  >
                    {prompt}
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          </div>
        ) : (
          <>
            <div ref={scrollRef} className="scroll-thin relative flex-1 overflow-y-auto px-4 py-8 sm:px-8">
              <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute inset-0 bg-grid opacity-[0.18] [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]" />
              </div>

              <div className="mx-auto max-w-3xl space-y-8 2xl:max-w-4xl">
                <AnimatePresence initial={false}>
                  {activeConversation.messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      layout
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ type: 'spring', stiffness: 340, damping: 32 }}
                      className={msg.role === 'user' ? 'flex justify-end' : 'group flex items-start gap-3'}
                    >
                      {msg.role === 'user' ? (
                        messageEnEdition === msg.id ? (
                          <div className="w-full max-w-[80%] space-y-2">
                            <textarea
                              value={texteEdition}
                              onChange={(e) => setTexteEdition(e.target.value)}
                              rows={2}
                              autoFocus
                              className="w-full resize-none rounded-2xl border border-gold-400/50 bg-white px-4 py-2.5 text-sm text-navy-900 shadow-sm outline-none focus:border-gold-400"
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={annulerEdition}
                                className="rounded-lg px-3 py-1.5 text-xs font-medium text-navy-700/60 transition-colors hover:bg-navy-900/5 hover:text-navy-900"
                              >
                                Annuler
                              </button>
                              <button
                                type="button"
                                onClick={() => soumettreEdition(msg, i)}
                                disabled={!texteEdition.trim() || thinking}
                                className="rounded-lg bg-gold-400 px-3 py-1.5 text-xs font-semibold text-navy-950 transition hover:bg-gold-300 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                Envoyer
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="group/msg relative max-w-[80%] rounded-2xl border border-navy-900/[0.06] bg-gradient-to-br from-navy-900/[0.06] to-navy-900/[0.03] px-4 py-2.5 text-navy-900 shadow-sm">
                            <MessageContent text={msg.content} />
                            <button
                              type="button"
                              onClick={() => commencerEdition(msg)}
                              title="Modifier"
                              aria-label="Modifier le message"
                              className="absolute -left-8 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-lg p-1.5 text-navy-700/40 opacity-100 transition-colors hover:bg-navy-900/5 hover:text-navy-700 sm:opacity-0 sm:group-hover/msg:opacity-100"
                            >
                              <Pencil size={13} />
                            </button>
                          </div>
                        )
                      ) : (
                        <>
                          <AvatarHalex />
                          <div className="min-w-0 max-w-full flex-1 text-navy-800">
                            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-gold-600/80">
                              Halex AI
                            </p>
                            {msg.type === 'clarification' ? (
                              <ChipsClarification
                                message={msg}
                                desactive={msg.resolue || thinking}
                                onChoix={(choix) => handleChoixClarification(i, choix)}
                              />
                            ) : (
                              <>
                                <div
                                  className={`transition-opacity ${regenerationEnCours === msg.id ? 'opacity-40' : ''}`}
                                >
                                  <MessageContent text={msg.content} />
                                  {msg.sources?.length > 0 && (
                                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                                      {msg.sources.map((src, srcIndex) => (
                                        <SourceChip
                                          key={srcIndex}
                                          article={src.article}
                                          source={src.source}
                                          onClick={() => setArticleOuvert(src)}
                                        />
                                      ))}
                                    </div>
                                  )}
                                </div>
                                <div
                                  className={`mt-2 flex items-center gap-1 transition-opacity ${
                                    regenerationEnCours === msg.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                  }`}
                                >
                                  <button
                                    type="button"
                                    onClick={() => copyMessage(msg.content, i)}
                                    title={chatText.copy}
                                    disabled={regenerationEnCours === msg.id}
                                    className="flex items-center gap-1 rounded-lg p-1.5 text-navy-700/40 transition-colors hover:bg-navy-900/5 hover:text-navy-700 disabled:cursor-not-allowed disabled:opacity-50"
                                  >
                                    {copiedIndex === i ? <Check size={13} /> : <Copy size={13} />}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => regenerate(i)}
                                    title={chatText.regenerate}
                                    disabled={regenerationEnCours === msg.id}
                                    className="flex items-center gap-1 rounded-lg p-1.5 text-navy-700/40 transition-colors hover:bg-navy-900/5 hover:text-navy-700 disabled:cursor-not-allowed disabled:opacity-50"
                                  >
                                    <RotateCw size={13} className={regenerationEnCours === msg.id ? 'animate-spin' : ''} />
                                  </button>
                                  <div className="relative">
                                    <button
                                      type="button"
                                      onClick={() => partagerReponse(i)}
                                      title="Partager"
                                      disabled={regenerationEnCours === msg.id}
                                      className="flex items-center gap-1 rounded-lg p-1.5 text-navy-700/40 transition-colors hover:bg-navy-900/5 hover:text-navy-700 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                      <Share2 size={13} />
                                    </button>
                                    {partageCopieIndex === i && (
                                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-navy-900 px-2 py-1 text-[10px] font-medium text-cream-100 shadow-lg">
                                        Copié !
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        </>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                <AnimatePresence>
                  {thinking && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 340, damping: 30 }}
                      className="flex items-start gap-3"
                    >
                      <AvatarHalex />
                      <div>
                        <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-gold-600/80">
                          Halex AI
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-navy-700/50">{chatText.thinking}</span>
                          <div className="flex items-center gap-1.5">
                            {[0, 1, 2].map((i) => (
                              <motion.span
                                key={i}
                                className="h-1.5 w-1.5 rounded-full bg-gold-400"
                                animate={{ y: [0, -5, 0] }}
                                transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="px-4 pb-5 pt-2 sm:px-8">
              {composer}
              <p className="mx-auto mt-2.5 max-w-3xl text-center text-xs text-navy-700/40 2xl:max-w-4xl">
                {chatText.disclaimer}
              </p>
            </form>
          </>
        )}
      </div>

      <AnimatePresence>
        {articleOuvert && (
          <ArticleModal
            key="article-modal"
            source={articleOuvert}
            onClose={() => setArticleOuvert(null)}
            t={chatText}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {parametresOuverts && (
          <ParametresModal
            key="parametres-modal"
            onClose={() => setParametresOuverts(false)}
            onHistoriqueEffacee={handleHistoriqueEffacee}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
