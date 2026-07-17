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
  Globe,
  ChevronDown,
  Copy,
  Check,
  RotateCw,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import MessageContent from '../components/MessageContent.jsx'
import Magnetic from '../components/motion/Magnetic.jsx'
import { seedConversations, suggestedPrompts, generateMockReply } from '../data/chatMock.js'

const languages = ['Kreyòl', 'Français', 'English']

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

const listContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}
const listItem = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
}

export default function Chat() {
  const { user, logout } = useAuth()
  const { lang: siteLang, t } = useLanguage()
  const chatText = t.chat
  const navigate = useNavigate()

  const [conversations, setConversations] = useState(() => seedConversations[siteLang])
  const [activeId, setActiveId] = useState(null)
  const [input, setInput] = useState('')
  const [inputFocused, setInputFocused] = useState(false)
  const [thinking, setThinking] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [search, setSearch] = useState('')
  const [langMenuOpen, setLangMenuOpen] = useState(false)
  const [replyLang, setReplyLang] = useState('Kreyòl')
  const [copiedIndex, setCopiedIndex] = useState(null)
  const scrollRef = useRef(null)
  const textareaRef = useRef(null)
  const langMenuRef = useRef(null)

  const activeConversation = conversations.find((c) => c.id === activeId) || null
  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()),
  )

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [activeConversation?.messages.length, thinking])

  useEffect(() => {
    if (!langMenuOpen) return
    function onClickOutside(e) {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target)) {
        setLangMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [langMenuOpen])

  function handleLogout() {
    logout()
    navigate('/')
  }

  function startNewConversation() {
    setActiveId(null)
    setSidebarOpen(false)
  }

  function autoGrow() {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`
  }

  function replyTo(convId, forMessage) {
    setThinking(true)
    setTimeout(() => {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === convId
            ? { ...c, messages: [...c.messages, { role: 'assistant', content: generateMockReply(forMessage, siteLang) }] }
            : c,
        ),
      )
      setThinking(false)
    }, 1100)
  }

  function sendMessage(text) {
    const content = text.trim()
    if (!content) return

    if (!activeConversation) {
      const newConv = {
        id: `c-${Date.now()}`,
        title: content.slice(0, 40) + (content.length > 40 ? '…' : ''),
        updatedAt: new Date().toISOString(),
        messages: [{ role: 'user', content }],
      }
      setConversations((prev) => [newConv, ...prev])
      setActiveId(newConv.id)
      setInput('')
      requestAnimationFrame(autoGrow)
      replyTo(newConv.id, content)
      return
    }

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversation.id
          ? { ...c, messages: [...c.messages, { role: 'user', content }] }
          : c,
      ),
    )
    setInput('')
    requestAnimationFrame(autoGrow)
    replyTo(activeConversation.id, content)
  }

  function regenerate(messageIndex) {
    if (!activeConversation || thinking) return
    const priorUserMsg = [...activeConversation.messages.slice(0, messageIndex)].reverse().find((m) => m.role === 'user')
    if (!priorUserMsg) return
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversation.id
          ? { ...c, messages: c.messages.slice(0, messageIndex) }
          : c,
      ),
    )
    replyTo(activeConversation.id, priorUserMsg.content)
  }

  function copyMessage(text, index) {
    navigator.clipboard?.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex((i) => (i === index ? null : i)), 1600)
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
      className="mx-auto w-full max-w-3xl overflow-visible rounded-3xl border border-navy-900/10 bg-white"
    >
      <div className="flex items-end gap-2 px-4 pt-3.5">
        <Sparkles size={17} className="mb-2 shrink-0 text-gold-400" />
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

      <div className="mt-2 flex items-center justify-between border-t border-navy-900/5 px-3 py-2">
        <div ref={langMenuRef} className="relative">
          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setLangMenuOpen((o) => !o)}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              langMenuOpen
                ? 'border-gold-400/50 bg-gold-50 text-gold-700'
                : 'border-navy-900/10 text-navy-700/70 hover:border-gold-400/40 hover:text-gold-600'
            }`}
          >
            <Globe size={13} />
            {replyLang}
            <ChevronDown size={13} className={`transition-transform ${langMenuOpen ? 'rotate-180' : ''}`} />
          </motion.button>

          <AnimatePresence>
            {langMenuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 6 }}
                transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
                className="absolute bottom-full left-0 z-30 mb-2 w-48 rounded-2xl border border-navy-900/10 bg-white p-2 shadow-2xl"
              >
                <p className="mb-1.5 px-2 pt-1 text-[10px] font-semibold uppercase tracking-wider text-navy-700/40">
                  {chatText.responseLanguageLabel}
                </p>
                {languages.map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => {
                      setReplyLang(l)
                      setLangMenuOpen(false)
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors ${
                      replyLang === l ? 'bg-navy-950 text-white' : 'text-navy-700 hover:bg-cream-100'
                    }`}
                  >
                    {l}
                    {replyLang === l && <Check size={14} />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.button
          whileHover={input.trim() ? { scale: 1.08 } : {}}
          whileTap={input.trim() ? { scale: 0.9 } : {}}
          type="submit"
          disabled={!input.trim()}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-400 text-navy-950 shadow-gold transition-colors hover:bg-gold-300 disabled:cursor-not-allowed disabled:bg-navy-900/10 disabled:text-navy-900/30 disabled:shadow-none"
        >
          <Send size={16} />
        </motion.button>
      </div>
    </motion.div>
  )

  return (
    <div className="flex h-[calc(100vh-73px)] bg-cream-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 flex transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ top: 73 }}
      >
        {/* Icon rail */}
        <div className="flex w-16 shrink-0 flex-col items-center gap-2 border-r border-white/5 bg-navy-950 py-4">
          <Magnetic>
            <Link
              to="/"
              title={chatText.backToSite}
              aria-label={chatText.backToSite}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-400 text-navy-950 shadow-gold transition hover:bg-gold-300"
            >
              <Scale size={18} />
            </Link>
          </Magnetic>

          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            onClick={startNewConversation}
            title={chatText.newChat}
            aria-label={chatText.newChat}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-cream-100/70 transition-colors hover:border-gold-400/40 hover:text-gold-300"
          >
            <Plus size={18} />
          </motion.button>

          <button
            className="hidden h-10 w-10 items-center justify-center rounded-xl text-cream-100/40 transition-colors hover:bg-white/5 hover:text-cream-100 lg:flex"
            onClick={() => setSidebarCollapsed((c) => !c)}
            title={sidebarCollapsed ? chatText.expandSidebar : chatText.collapseSidebar}
            aria-label={sidebarCollapsed ? chatText.expandSidebar : chatText.collapseSidebar}
          >
            {sidebarCollapsed ? <PanelLeft size={17} /> : <PanelLeftClose size={17} />}
          </button>

          <div className="flex-1" />

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-400 text-sm font-bold text-navy-950">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleLogout}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-cream-100/40 transition-colors hover:bg-white/5 hover:text-gold-300"
            title={chatText.logout}
            aria-label={chatText.logout}
          >
            <LogOut size={16} />
          </motion.button>
          <button
            className="mt-1 flex h-9 w-9 items-center justify-center rounded-xl text-cream-100/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* Conversation list panel */}
        <AnimatePresence initial={false}>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 272, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col overflow-hidden border-r border-white/5 bg-navy-950"
            >
              <div className="w-[272px] p-3 pb-2">
                <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2">
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
                        onClick={() => {
                          setActiveId(conv.id)
                          setSidebarOpen(false)
                        }}
                        className={`relative flex w-full items-center gap-2.5 truncate rounded-lg px-2.5 py-2 text-left text-sm transition-colors ${
                          isActive ? 'text-white' : 'text-cream-100/55 hover:bg-white/5 hover:text-cream-100'
                        }`}
                      >
                        {isActive && (
                          <motion.span
                            layoutId="conv-active-pill"
                            className="absolute inset-0 rounded-lg bg-white/10"
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
            style={{ top: 73 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Main chat area */}
      <div className="relative flex min-w-0 flex-1 flex-col">
        <div className="relative z-20 flex items-center gap-3 px-4 py-3 sm:px-6">
          <button
            className="rounded-lg p-2 text-navy-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>
          <div className="truncate text-sm font-medium text-navy-800/70">
            {activeConversation ? activeConversation.title : chatText.brand}
          </div>
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
              className="relative w-full max-w-2xl text-center"
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

              <motion.div
                variants={listContainer}
                className="mt-6 flex flex-wrap items-center justify-center gap-2"
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
            <div ref={scrollRef} className="scroll-thin flex-1 overflow-y-auto px-4 py-8 sm:px-8">
              <div className="mx-auto max-w-3xl space-y-8">
                <AnimatePresence initial={false}>
                  {activeConversation.messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      layout
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ type: 'spring', stiffness: 340, damping: 32 }}
                      className={msg.role === 'user' ? 'flex justify-end' : 'group'}
                    >
                      {msg.role === 'user' ? (
                        <div className="max-w-[80%] rounded-2xl bg-navy-900/[0.06] px-4 py-2.5 text-navy-900">
                          <MessageContent text={msg.content} />
                        </div>
                      ) : (
                        <div className="max-w-full text-navy-800">
                          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-gold-600/80">
                            Halex AI
                          </p>
                          <MessageContent text={msg.content} />
                          <div className="mt-2 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                            <button
                              type="button"
                              onClick={() => copyMessage(msg.content, i)}
                              title={chatText.copy}
                              className="flex items-center gap-1 rounded-lg p-1.5 text-navy-700/40 transition-colors hover:bg-navy-900/5 hover:text-navy-700"
                            >
                              {copiedIndex === i ? <Check size={13} /> : <Copy size={13} />}
                            </button>
                            <button
                              type="button"
                              onClick={() => regenerate(i)}
                              title={chatText.regenerate}
                              className="flex items-center gap-1 rounded-lg p-1.5 text-navy-700/40 transition-colors hover:bg-navy-900/5 hover:text-navy-700"
                            >
                              <RotateCw size={13} />
                            </button>
                          </div>
                        </div>
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
                    >
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="px-4 pb-5 pt-2 sm:px-8">
              {composer}
              <p className="mx-auto mt-2.5 max-w-3xl text-center text-xs text-navy-700/40">
                {chatText.disclaimer}
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
